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
        console.log(abc)
        if (abc.status === 201){
            
            window.location.href = "./login.html"
        
        }else {
            throw new Error('Unable to Sign you Up')
        }
    
       
} catch (err) {
    if (err.response && err.response.status === 409) {
      alert(err.response.data.message)
    } else {
      document.body.innerHTML = document.body.innerHTML + "<h3 style='color:red'> Some Error Occured! </h3>"
      console.log("Error Block: ",err)
    }                
    }}