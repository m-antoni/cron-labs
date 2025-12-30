import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import nodemailer from 'nodemailer';
import { formatDuration } from '@/app/lib/helpers';

export async function GET(request: Request) {
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
    // -----------------------------
    // DATABASE QUERY
    // -----------------------------
    const [userCount, envVarCount, appsCount, executionLogsCount, logCleanupSummariesCount] =
      await prisma.$transaction([
        prisma.user.count(),
        prisma.envVar.count(),
        prisma.app.count(),
        prisma.executionLog.count(),
        prisma.logCleanupSummary.count(),
      ]);

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

    const processDuration = Date.now() - startTime;

    const emailPayload = {
      subject: `CronLabs Database Health Notification`,
      url: `${process.env.NEXT_PUBLIC_SITE_URL}`,
      body: `User Table: ${userCount}, Apps Table: ${appsCount}, Execution Logs Table: ${executionLogsCount}, Log Cleanup Summaries Table: ${logCleanupSummariesCount}`,
      website,
    };

    // -----------------------------
    // SEND NOTIFICATION EMAIL
    // -----------------------------
    // IMPORTANT: Use 'await' here to ensure the email sends before the serverless function shuts down.
    await transporter.sendMail({
      from: `"CronLabs System" <${process.env.SMTP_USER}>`,
      to: process.env.CONTACT_RECEIVER,
      subject: `[CronLabs] Database Health Check`,
      text: `Database Health Check.`,
      html: `
               <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; border: 1px solid #ddd; border-radius: 3px; overflow: hidden;">
            <div style="background-color: #212529; color: white; padding: 15px; text-align: center;">
              <h2 style="margin: 0; font-size: 18px;">CronLabs Database Health Check</h2>
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
                        }" style="color: #007BFF; text-decoration: none;">${
        emailPayload.website
      }</a>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; width: 120px;"><strong>Total User:</strong></td>
                        <td style="padding: 8px 0;">${userCount}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; width: 120px;"><strong>Environment Variables:</strong></td>
                        <td style="padding: 8px 0;">${envVarCount}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; width: 120px;"><strong> Apps:</strong></td>
                        <td style="padding: 8px 0;">${appsCount}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; width: 120px;"><strong>Execution Logs:</strong></td>
                        <td style="padding: 8px 0;">${executionLogsCount}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; width: 120px;"><strong> Logs Cleanup Summary:</strong></td>
                        <td style="padding: 8px 0;">${logCleanupSummariesCount}</td>
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
      total_user_table_rows: userCount,
      total_env_vars_table_rows: envVarCount,
      total_apps_table_rows: appsCount,
      total_execution_logs_table_rows: executionLogsCount,
      total_log_cleanup_summaries_table_rows: logCleanupSummariesCount,
      metadata: {
        source: isManual ? 'Manual Action' : 'Automated Cron',
        userAgent: userAgent,
        duration: `${formatDuration(processDuration)}`,
      },
    });
  } catch (error) {
    console.error('Status health check error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
