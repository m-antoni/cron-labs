'use client';

import { FaMagnifyingGlass, FaBell } from 'react-icons/fa6';
import { usePathname } from 'next/navigation';
import { signOutProvider } from '../actions/auth';
import ProfileImage from '@/app/components/ui/ProfileImage';
import { useUser } from '../hooks/useAuth';

export default function Navbar() {
  const pathname = usePathname();
  const currentPage = pathname.split('/')[1] === 'cronlabs' ? 'Dashboard' : pathname.split('/')[1];

  const { user } = useUser();

  const userImage = user?.image ? user?.image : '/assets/img/anime3.png';

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-absolute navbar-transparent">
        <div className="container-fluid">
          <div className="navbar-wrapper">
            {/* <div className="navbar-toggle d-inline">
              <button type="button" className="navbar-toggler">
                <span className="navbar-toggler-bar bar1" />
                <span className="navbar-toggler-bar bar2" />
                <span className="navbar-toggler-bar bar3" />
              </button>
            </div> */}
            <a className="navbar-brand" href="#" style={{ marginLeft: '-7px', fontWeight: '500' }}>
              {currentPage}
            </a>
          </div>
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navigation"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-bar navbar-kebab" />
            <span className="navbar-toggler-bar navbar-kebab" />
            <span className="navbar-toggler-bar navbar-kebab" />
          </button>
          <div className="collapse navbar-collapse" id="navigation">
            <ul className="navbar-nav ml-auto">
              <li className="search-bar input-group mt-1">
                <button
                  className="btn btn-link"
                  id="search-button"
                  data-toggle="modal"
                  data-target="#searchModal"
                >
                  {/* <FaMagnifyingGlass size={16} className="text-light mb-1 mr-n2" /> */}
                  {/* <span className="d-lg-none d-md-block">Search</span> */}
                </button>
              </li>
              {/* <li className="dropdown nav-item mt-1">
                <a
                  href="javascript:void(0)"
                  className="dropdown-toggle nav-link mr-n1"
                  data-toggle="dropdown"
                >
                  <FaBell size={16} />
                  <div className="notification d-none d-lg-block d-xl-block" />
                  <p className="d-lg-none">Notifications</p>
                </a>
                <ul className="dropdown-menu dropdown-menu-right dropdown-navbar">
                  <li className="nav-link">
                    <a href="#" className="nav-item dropdown-item">
                      Mike John responded to your email
                    </a>
                  </li>
                  <li className="nav-link">
                    <a href="javascript:void(0)" className="nav-item dropdown-item">
                      You have 5 more tasks
                    </a>
                  </li>
                  <li className="nav-link">
                    <a href="javascript:void(0)" className="nav-item dropdown-item">
                      Your friend Michael is in town
                    </a>
                  </li>
                  <li className="nav-link">
                    <a href="javascript:void(0)" className="nav-item dropdown-item">
                      Another notification
                    </a>
                  </li>
                  <li className="nav-link">
                    <a href="javascript:void(0)" className="nav-item dropdown-item">
                      Another one
                    </a>
                  </li>
                </ul>
              </li> */}
              <li className="dropdown nav-item">
                <a href="#" className="dropdown-toggle nav-link" data-toggle="dropdown">
                  <div className="photo">
                    <img src={userImage} alt="Profile Photo" />
                    {/* <ProfileImage /> */}
                  </div>
                  <b className="caret d-none d-lg-block d-xl-block" />
                  <p className="d-lg-none">Log out</p>
                </a>
                <ul className="dropdown-menu dropdown-navbar">
                  {/* <li className="nav-link">
                    <a href="javascript:void(0)" className="nav-item dropdown-item">
                      Profile
                    </a>
                  </li>
                  <li className="nav-link">
                    <a href="javascript:void(0)" className="nav-item dropdown-item">
                      Settings
                    </a>
                  </li>
                  <li className="dropdown-divider" /> */}
                  <li className="nav-link">
                    <a
                      href="javascript:void(0)"
                      className="nav-item dropdown-item"
                      onClick={() => signOutProvider()}
                    >
                      Log out
                    </a>
                  </li>
                </ul>
              </li>
              <li className="separator d-lg-none" />
            </ul>
          </div>
        </div>
      </nav>
      <div
        className="modal modal-search fade"
        id="searchModal"
        tabIndex={-1}
        role="dialog"
        aria-labelledby="searchModal"
        aria-hidden="true"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <input
                type="text"
                className="form-control"
                id="inlineFormInputGroup"
                placeholder="SEARCH"
              />
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <i className="tim-icons icon-simple-remove" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
