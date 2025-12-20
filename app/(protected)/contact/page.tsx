import Image from 'next/image';
import Link from 'next/link';

export default function Contact() {
  return (
    <div className="row">
      <div className="col-md-6">
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
          <div className="card-footer">
            <table className="table table-borderless mb-0 ml-5">
              <tbody>
                <tr>
                  <th className="text-white text-left">Website</th>
                  <td>
                    <Link href="https://michaelantoni.vercel.app" target="_blank">
                      <span className="text-warning">https://michaelantoni.vercel.app</span>
                    </Link>
                  </td>
                </tr>
                <tr>
                  <th className="text-white text-left">LinkedIn</th>
                  <td>
                    <Link href="https://www.linkedin.com/in/m-antoni" target="_blank">
                      <span className="text-warning">https://www.linkedin.com/in/m-antoni</span>
                    </Link>
                  </td>
                </tr>
                <tr>
                  <th className="text-white text-left">GitHub</th>
                  <td>
                    <Link href="https://www.github.com/m-antoni" target="_blank">
                      <span className="text-warning">https://www.github.com/m-antoni</span>
                    </Link>
                  </td>
                </tr>
                <tr>
                  <th className="text-white text-left">Email</th>
                  <td>
                    <span className="text-warning">michaelantoni.tech@gmail.com</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className="col-md-6">
        <div className="card">
          <div className="card-header">
            <h4 className="title ">Contact Me!</h4>
          </div>
          <div className="card-body">
            <form>
              <div className="row">
                <div className="col-md-12">
                  <div className="form-group">
                    <label>Email:</label>
                    <input type="text" className="form-control" placeholder="john@yourmail.com" />
                  </div>
                  <div className="form-group">
                    <label>Subject:</label>
                    <input type="text" className="form-control" placeholder="Subject" />
                  </div>
                  <div className="form-group">
                    <label>Body:</label>
                    <textarea
                      className="form-control c-textarea"
                      placeholder="Your message content"
                    />
                  </div>
                </div>
              </div>
            </form>
          </div>
          <div className="card-footer d-flex justify-content-end pb-4 mt-n3">
            <button type="submit" className="btn btn-fill btn-warning px-3">
              Send Message
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
