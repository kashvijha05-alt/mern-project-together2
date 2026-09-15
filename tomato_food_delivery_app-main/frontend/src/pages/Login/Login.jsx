import React, { useContext, useState } from 'react'
import './Login.css'
import { assets } from '../../assets/assets'
import { StoreContext } from '../../Context/StoreContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const Login = () => {

    // "Login" = existing user, "Sign Up" = new user.
    const [currState, setCurrState] = useState("Login")
    const [showPassword, setShowPassword] = useState(false)
    const [submitting, setSubmitting] = useState(false)

    const { setToken, url, loadCartData } = useContext(StoreContext)

    const [data, setData] = useState({
        name: "",
        email: "",
        password: ""
    })

    // One handler for every input: it uses the input's `name` attribute
    // to decide which field of `data` to update.
    const onChangeHandler = (event) => {
        const { name, value } = event.target
        setData(prev => ({ ...prev, [name]: value }))
    }

    const onSubmit = async (event) => {
        event.preventDefault()
        setSubmitting(true)

        // Pick the right backend endpoint for the current mode.
        const endpoint = currState === "Login"
            ? "/api/user/login"
            : "/api/user/register"

        try {
            const response = await axios.post(url + endpoint, data)

            if (response.data.success) {
                // Save the token in React state AND in localStorage so the
                // user stays logged in after a page refresh.
                setToken(response.data.token)
                localStorage.setItem("token", response.data.token)
                await loadCartData({ token: response.data.token })
                toast.success(currState === "Login" ? "Welcome back!" : "Account created!")
            } else {
                toast.error(response.data.message)
            }
        } catch (error) {
            toast.error("Could not reach the server. Please try again.")
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div className='login-page'>

            {/* LEFT SIDE — brand panel */}
            <div className="login-brand">
                <img src={assets.logo} alt="Zavora" className='login-brand-logo' />
                <h1>Every bite, a story.</h1>
                <p>
                    Sign in to browse the menu, build your cart and track your
                    orders from start to doorstep.
                </p>
            </div>

            {/* RIGHT SIDE — the actual form */}
            <div className="login-form-side">
                <form className='login-card' onSubmit={onSubmit}>

                    <img src={assets.logo} alt="Zavora" className='login-card-logo' />

                    <h2>{currState === "Login" ? "Welcome back" : "Create your account"}</h2>
                    <p className='login-card-subtitle'>
                        {currState === "Login"
                            ? "Log in to continue ordering."
                            : "It only takes a few seconds."}
                    </p>

                    <div className="login-inputs">

                        {/* The name field is only needed when signing up. */}
                        {currState === "Sign Up" && (
                            <div className="login-field">
                                <label htmlFor="name">Full name</label>
                                <input
                                    id="name"
                                    name='name'
                                    type="text"
                                    placeholder='e.g. Ananya Sharma'
                                    value={data.name}
                                    onChange={onChangeHandler}
                                    required
                                />
                            </div>
                        )}

                        <div className="login-field">
                            <label htmlFor="email">Email address</label>
                            <input
                                id="email"
                                name='email'
                                type="email"
                                placeholder='you@example.com'
                                value={data.email}
                                onChange={onChangeHandler}
                                required
                            />
                        </div>

                        <div className="login-field">
                            <label htmlFor="password">Password</label>
                            <div className="login-password-wrap">
                                <input
                                    id="password"
                                    name='password'
                                    type={showPassword ? "text" : "password"}
                                    placeholder='At least 8 characters'
                                    value={data.password}
                                    onChange={onChangeHandler}
                                    minLength={8}
                                    required
                                />
                                <button
                                    type='button'
                                    className='login-password-toggle'
                                    onClick={() => setShowPassword(prev => !prev)}
                                >
                                    {showPassword ? "Hide" : "Show"}
                                </button>
                            </div>
                        </div>
                    </div>

                    <button type='submit' className='login-submit' disabled={submitting}>
                        {submitting
                            ? "Please wait..."
                            : currState === "Login" ? "Log in" : "Create account"}
                    </button>

                    <p className='login-switch'>
                        {currState === "Login"
                            ? <>New here? <span onClick={() => setCurrState("Sign Up")}>Create an account</span></>
                            : <>Already have an account? <span onClick={() => setCurrState("Login")}>Log in</span></>}
                    </p>

                    <p className='login-terms'>
                        By continuing you agree to our terms of use &amp; privacy policy.
                    </p>
                </form>
            </div>
        </div>
    )
}

export default Login
