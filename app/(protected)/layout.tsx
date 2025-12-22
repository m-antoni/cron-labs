import Footer from '@/app/components/Footer';
import Navbar from '@/app/components/Navbar';
import Sidebar from '@/app/components/Sidebar';

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="wrapper">
        <Sidebar />
        <div className="main-panel">
          <Navbar />
          <div className="content">{children}</div>
          {/* <Footer /> */}
        </div>
      </div>
      {/* <div className="fixed-plugin">
        <div className="dropdown show-dropdown">
          <a href="#" data-toggle="dropdown">
            <i className="fa fa-cog fa-2x"> </i>
          </a>
          <ul className="dropdown-menu">
            <li className="header-title">Sidebar Background</li>
            <li className="adjustments-line">
              <a href="javascript:void(0)" className="switch-trigger background-color">
                <div className="badge-colors text-center">
                  <span className="badge filter badge-primary active" data-color="primary" />
                  <span className="badge filter badge-info" data-color="blue" />
                  <span className="badge filter badge-success" data-color="green" />
                </div>
                <div className="clearfix" />
              </a>
            </li>
            <li className="adjustments-line text-center color-change">
              <span className="color-label">LIGHT MODE</span>
              <span className="badge light-badge mr-2" />
              <span className="badge dark-badge ml-2" />
              <span className="color-label">DARK MODE</span>
            </li>
            <li className="button-container">
              <a
                href="https://www.creative-tim.com/product/black-dashboard"
                target="_blank"
                className="btn btn-primary btn-block btn-round"
              >
                Download Now
              </a>
              <a
                href="https://demos.creative-tim.com/black-dashboard/docs/1.0/getting-started/introduction.html"
                target="_blank"
                className="btn btn-default btn-block btn-round"
              >
                Documentation
              </a>
            </li>
            <li className="header-title">Thank you for 95 shares!</li>
            <li className="button-container text-center">
              <button id="twitter" className="btn btn-round btn-info">
                <i className="fab fa-twitter" /> · 45
              </button>
              <button id="facebook" className="btn btn-round btn-info">
                <i className="fab fa-facebook-f" /> · 50
              </button>
              <br />
              <br />
              <a
                className="github-button"
                href="https://github.com/creativetimofficial/black-dashboard"
                data-icon="octicon-star"
                data-size="large"
                data-show-count="true"
                aria-label="Star ntkme/github-buttons on GitHub"
              >
                Star
              </a>
            </li>
          </ul>
        </div>
      </div> */}
    </>
  );
}
