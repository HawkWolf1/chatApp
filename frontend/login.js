async function login(event){
    event.preventDefault()
    const email = document.getElementById('email').value
    const password = document.getElementById('password').value

        const loginD = {
            email,
            password
        }
        console.log(loginD)
        try{
            const pqr = await axios.post("http://localhost:4000/user/login", loginD) 
            console.log(pqr)
            alert(pqr.data.message)
            if (pqr.status === 200){     
                    localStorage.setItem('token', pqr.data.token) 
                    localStorage.setItem('name', pqr.data.name) 
                    localStorage.setItem('userId', pqr.data.id) 
                    window.location.href = "./group.html"                   
                    } else {
                        throw new Error('Unable to log you in!')
                    }
            
        }
                   
        catch(err){
            console.log(JSON.stringify(err))
            document.body.innerHTML = document.body.innerHTML + "<h3 style='color:red'> We have an Error!!! </h3>"
            
        }                  
            }