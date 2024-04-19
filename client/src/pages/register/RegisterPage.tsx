import ThemeButton from '../../components/etc/ThemeButton'

const RegisterPage = () => {
  return (
    <div className="full-page relative">
        <div className="w-80 flex flex-col item-center">
            <form className="w-full flex flex-col items-center gap-3" onSubmit={(e) => {e.preventDefault()}}>
              <h2>Create Account</h2>
              
              <button type="submit" className="primary-button">Register</button>
            </form>
          
        </div>
        <div className="absolute top-5 right-5">
          <ThemeButton />
        </div>
    </div>
  )
}

export default RegisterPage