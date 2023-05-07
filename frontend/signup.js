async function newF(event){
    event.preventDefault()
    const name = document.getElementById('name').value
    const email = document.getElementById('email').value
    const phoneNo = document.getElementById('phoneNo').value
    const password = document.getElementById('password').value

    const myObject = {
        name,
        email,
        phoneNo,
        password
    }
    try{
        const abc = await axios.post("http://localhost:4000/user/add-user", myObject) 
        if (abc.status === 201){
            
            window.location.href = "./login.html"
        } else {
            throw new Error('Unable to Sign you Up')
        }
    }
       
    catch(err){
        document.body.innerHTML = document.body.innerHTML + "<h3 style='color:red'> Something went wrong!!! </h3>"
        console.log("Error Block: ",err)
    }                  
}