import React, { useContext, useRef, useState } from 'react'
import './Navbar.css'
import { assets } from '../../assets/assets'
import { Link, useNavigate } from 'react-router-dom'
import { StoreContext } from '../../Context/StoreContext'

const Navbar = () => {

  const [menu, setMenu] = useState("home");

  // Controls whether the search input is expanded or collapsed to just an icon.
  const [searchOpen, setSearchOpen] = useState(false);
  const searchInputRef = useRef(null);

  const {
    getTotalCartAmount,
    searchQuery,
    setSearchQuery,
    logout
  } = useContext(StoreContext);

  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  }

  const openSearch = () => {
    setSearchOpen(true);
    // Focus the input right after it appears so the user can type immediately.
    setTimeout(() => searchInputRef.current?.focus(), 0);
  }

  const closeSearch = () => {
    setSearchOpen(false);
    setSearchQuery("");
  }

  const onSearchChange = (event) => {
    setSearchQuery(event.target.value);
    // Searching from the cart page should take you back to the menu.
    navigate('/');
  }

  const onSearchKeyDown = (event) => {
    if (event.key === "Escape") {
      closeSearch();
    }
    if (event.key === "Enter") {
      event.preventDefault();
      document.getElementById('food-display')?.scrollIntoView({ behavior: 'smooth' });
    }
  }

  return (
    <div className='navbar'>

      <Link to='/'>
        <img className='logo' src={assets.logo} alt="Zavora" />
      </Link>

      <ul className="navbar-menu">
        <Link to="/" onClick={() => setMenu("home")} className={`${menu === "home" ? "active" : ""}`}>home</Link>
        <a href='#explore-menu' onClick={() => setMenu("menu")} className={`${menu === "menu" ? "active" : ""}`}>menu</a>
        <a href='#app-download' onClick={() => setMenu("mob-app")} className={`${menu === "mob-app" ? "active" : ""}`}>mobile app</a>
        <a href='#footer' onClick={() => setMenu("contact")} className={`${menu === "contact" ? "active" : ""}`}>contact us</a>
      </ul>

      <div className="navbar-right">

        {/* ---------- SEARCH BAR ---------- */}
        <div className={`navbar-search ${searchOpen ? "open" : ""}`}>
          <img
            src={assets.search_icon}
            alt="Search"
            className='navbar-search-trigger'
            onClick={searchOpen ? undefined : openSearch}
          />
          <input
            ref={searchInputRef}
            type="text"
            placeholder='Search dishes, e.g. "salad"'
            value={searchQuery}
            onChange={onSearchChange}
            onKeyDown={onSearchKeyDown}
            aria-label='Search dishes'
          />
          {searchOpen && (
            <button
              type='button'
              className='navbar-search-close'
              onClick={closeSearch}
              aria-label='Close search'
            >
              ✕
            </button>
          )}
        </div>

        <Link to='/cart' className='navbar-cart-icon'>
          <img src={assets.basket_icon} alt="Cart" />
          <div className={getTotalCartAmount() > 0 ? "dot" : ""}></div>
        </Link>

        <div className='navbar-profile'>
          <img src={assets.profile_icon} alt="Profile" />
          <ul className='navbar-profile-dropdown'>
            <li onClick={() => navigate('/myorders')}> <img src={assets.bag_icon} alt="" /> <p>Orders</p></li>
            <hr />
            <li onClick={handleLogout}> <img src={assets.logout_icon} alt="" /> <p>Logout</p></li>
          </ul>
        </div>

      </div>
    </div>
  )
}

export default Navbar
