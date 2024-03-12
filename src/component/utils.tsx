export const displayError = (setOpenError:any, setErrorText:any, setError:any, message: string) => {
    setOpenError(true)
    setErrorText(message)
    setError(true)
    setTimeout(() => {
        setOpenError(false);
        setError(false)
    }, 2000)
    return
}