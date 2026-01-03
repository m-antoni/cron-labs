import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import nodemailer from 'nodemailer';
import { formatDuration } from '@/app/lib/helpers';

export async function GET(request: Request) {
  // -----------------------------
  // GET QUERY PARAMETERS
  // -----------------------------
  const { searchParams } = new URL(request.url);
  const keepDays = Number(searchParams.get('keep')) || 0;
  const latestCount = Number(searchParams.get('latest')) || 0;

  // -----------------------------
  // AUTHORIZATION CHECK
  // -----------------------------
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  // Detect if the request is coming from cron-job.org
  const userAgent = request.headers.get('user-agent') || '';
  const isCronJobService = userAgent.includes('cron-job.org');
  const isManual = !isCronJobService;

  const startTime = Date.now();

  try {
    let deleteWhereClause = {};
    let cleanupDescription = '';

    // -----------------------------
    // DEFINE CLEANUP STRATEGY
    // -----------------------------
    if (latestCount > 0) {
      // STRATEGY: Delete the most recent logs
      const latestLogs = await prisma.executionLog.findMany({
        take: latestCount,
        orderBy: { createdAt: 'desc' },
        select: { id: true },
      });

      const idsToDelete = latestLogs.map((log) => log.id);
      // Safety: Only proceed if there are actual IDs to delete
      if (idsToDelete.length > 0) {
        deleteWhereClause = { id: { in: idsToDelete } };
      } else {
        // If no logs exist, ensure we don't delete everything by accident
        deleteWhereClause = { id: 'non-existent-id' };
      }
      cleanupDescription = `Manual: Deleted latest ${latestCount} logs`;
    } else {
      // STRATEGY: Use Date-based retention
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - keepDays);

      deleteWhereClause = { createdAt: { lt: cutoffDate } };
      cleanupDescription =
        keepDays === 0 ? 'Full Database clean-up' : `Retention: Kept last ${keepDays} days`;
    }

    // -----------------------------
    // GATHER STATS & EXECUTE
    // -----------------------------
    // We use the same 'deleteWhereClause' for both counting and deleting
    const [successCount, failureCount] = await Promise.all([
      prisma.executionLog.count({ where: { ...deleteWhereClause, success: true } }),
      prisma.executionLog.count({ where: { ...deleteWhereClause, success: false } }),
    ]);

    const deleteResult = await prisma.executionLog.deleteMany({
      where: deleteWhereClause,
    });

    const processDuration = Date.now() - startTime;

    // -----------------------------
    // SAVE SUMMARY WITH METADATA
    // -----------------------------
    await prisma.logCleanupSummary.create({
      data: {
        totalRowsDeleted: deleteResult.count,
        successfulJobs: successCount,
        failedJobs: failureCount,
        durationMs: processDuration,
        description: cleanupDescription,
        isManual: isManual, // True if you visited via browser/Postman
      },
    });

    // -----------------------------
    // CONFIGURE EMAIL TRANSPORTER
    // -----------------------------
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const website =
      process.env.NODE_ENV === 'development'
        ? 'http://localhost:3000'
        : 'https://m-antoni-cronlabs.vercel.app';

    const emailPayload = {
      subject: `CronLabs Clean Up Database Notification`,
      url: `${process.env.NEXT_PUBLIC_SITE_URL}`,
      body: `${deleteResult.count}, ${cleanupDescription}`,
      website,
    };

    // -----------------------------
    // SEND NOTIFICATION EMAIL
    // -----------------------------
    // IMPORTANT: Use 'await' here to ensure the email sends before the serverless function shuts down.
    await transporter.sendMail({
      from: `"CronLabs System" <${process.env.SMTP_USER}>`,
      to: process.env.CONTACT_RECEIVER,
      subject: `[CronLabs] Database Cleanup`,
      text: `Database cleanup completed.\n${emailPayload.body}`,
      html: `
             <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 3px; overflow: hidden;">
          <div style="background-color: #2b3553; color: white; padding: 15px; text-align: center;">
            <h2 style="margin: 0; font-size: 18px;">CronLabs Database Cleanup</h2>
          </div>
          <div style="padding: 20px;">
            <p style="border-bottom: 1px solid #eee; padding-bottom: 10px; margin-bottom: 15px;">
              <strong>Received At:</strong> ${new Date().toLocaleString('en-US', {
                timeZone: 'Asia/Manila',
              })}
            </p>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                <tr>
                    <td style="padding: 8px 0; width: 120px;"><strong>Sender App:</strong></td>
                    <td style="padding: 8px 0;">
                    <a href="${
                      emailPayload.website
                    }" style="color: #007BFF; text-decoration: none;">${emailPayload.website}</a>
                    </td>
                </tr>
                <tr>
                    <td style="padding: 8px 0; width: 120px;"><strong>Deleted Rows:</strong></td>
                    <td style="padding: 8px 0;">${deleteResult.count}</td>
                </tr>
                <tr>
                    <td style="padding: 8px 0; width: 120px;"><strong>Success Jobs:</strong></td>
                    <td style="padding: 8px 0;">${successCount}</td>
                </tr>
                <tr>
                    <td style="padding: 8px 0; width: 120px;"><strong>Failed Jobs:</strong></td>
                    <td style="padding: 8px 0;">${failureCount}</td>
                </tr>
                <tr>
                    <td style="padding: 8px 0; width: 140px;"><strong>Trigger:</strong></td>
                    <td style="padding: 8px 0;">
                        ${isManual ? 'Manual Action' : 'Automated Cron'} 
                        <br />
                        <span style="font-size: 14px; color: #888;">(${userAgent})</span>
                    </td>
                </tr>
                <tr>
                    <td style="padding: 8px 0; width: 120px;"><strong>Duration:</strong></td>
                    <td style="padding: 8px 0;">${formatDuration(processDuration)}</td>
                </tr>
                <tr>
                    <td style="padding: 8px 0; width: 120px;"><strong>Description:</strong></td>
                    <td style="padding: 8px 0;">${emailPayload.body}</td>
                </tr>
            </table>
          </div>
          <div style="background-color: #f1f1f1; color: #6c757d; padding: 10px; text-align: center; font-size: 12px;">
            Automated notification via NodeMailer.
          </div>
        </div>
        `,
    });

    // -----------------------------
    // RETURN SUCCESS RESPONSE
    // -----------------------------
    return NextResponse.json({
      status: 'success',
      rowsRemoved: deleteResult.count,
      description: cleanupDescription,
      metadata: {
        source: isManual ? 'Manual Action' : 'Automated Cron',
        userAgent: userAgent,
        duration: `${formatDuration(processDuration)}`,
      },
    });
  } catch (error) {
    console.error('Cleanup Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
