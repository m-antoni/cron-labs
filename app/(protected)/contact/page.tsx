import Image from 'next/image';
import Link from 'next/link';

export default function Contact() {
  return (
    <div className="row">
      <div className="col-md-12">
        <div className="card card-user">
          <div className="card-body">
            <p className="card-text"></p>
            <div className="author">
              <div className="block block-one" />
              <div className="block block-two" />
              <div className="block block-three" />
              <div className="block block-four" />
              <a href="javascript:void(0)">
                <Image
                  width={600}
                  height={600}
                  src="/assets/img/michael.jpg"
                  className="avatar"
                  alt="profile"
                />
                <h3 className="title">Michael Antoni</h3>
              </a>
              <p className="description">🧠 Learn | 💻 Build | 🚀 Grow</p>
            </div>
            <p />
            <div className="card-description text-center">
              Thank you for visiting my small project hope you enjoy it!
            </div>
          </div>
          <div className="d-flex justify-content-center">
            <table className="table table-borderless mb-0 mx-auto w-auto">
              <tbody>
                <tr className="text-center">
                  <th className="text-white text-center">Website</th>
                  <td className="text-left">
                    <Link href="https://michaelantoni.vercel.app" target="_blank">
                      <span className="text-warning">https://michaelantoni.vercel.app</span>
                    </Link>
                  </td>
                </tr>
                <tr>
                  <th className="text-white text-center">LinkedIn</th>
                  <td className="text-left">
                    <Link href="https://www.linkedin.com/in/m-antoni" target="_blank">
                      <span className="text-warning">https://www.linkedin.com/in/m-antoni</span>
                    </Link>
                  </td>
                </tr>
                <tr>
                  <th className="text-white text-center">GitHub</th>
                  <td className="text-left">
                    <Link href="https://www.github.com/m-antoni" target="_blank">
                      <span className="text-warning">https://www.github.com/m-antoni</span>
                    </Link>
                  </td>
                </tr>
                <tr>
                  <th className="text-white text-center">Email</th>
                  <td className="text-left">
                    <span className="text-warning">michaelantoni.tech@gmail.com</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="card-footer"></div>
        </div>
      </div>
    </div>
  );
}
