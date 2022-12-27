// Welcome Screen
const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('container');

signUpButton.addEventListener('click', () => {
	container.classList.add("right-panel-active");
});

signInButton.addEventListener('click', () => {
	container.classList.remove("right-panel-active");
});

// Start
let UserUrl="http://localhost:4000/users"
let signUpBtn=document.getElementById("sign-up-btn")
let signInBtn=document.getElementById("sign-in-btn")
let forgotPassUrl="http://localhost:4000/forgotPassword/"
let forgotBtn=document.getElementById('forgot-password')

signUpBtn.addEventListener('click', signUp)
signInBtn.addEventListener('click', signIn)
forgotBtn.addEventListener('click', forgotPassword)

// Sign up
function signUp(){
    const name=document.getElementById('name-up').value
    const email=document.getElementById('email-up').value
    const password=document.getElementById('pass-up').value
    if (name.length<3 || !isNaN(name) || name==" "){
        alert("Enter a valid name!")
        return
    }
    else if (email.length<5 || email.indexOf('@')==-1){
        alert("Enter a valid email!")
        return
    }
    else if(password.length<4){
        alert("Enter a strong password!")
        return
    }else{
        document.getElementById('name-up').value=""
        document.getElementById('email-up').value=""
        document.getElementById('pass-up').value=""
    }
    axios({
        method: 'post',
        url: `${UserUrl}`,
        data:{
            name: name,
            email:email,
            password:password
        }
    }).then(response=>{
        console.log(response)
        if(response.data[1]==false){
            alert("You already have an account with us! Please Login...")
        }
        else{
            alert("Sign Up Successful")
            // window.location.replace("./index.html");
            document.getElementById('email-in').value=email
        }
    }).catch(err=>console.log(err))
}

// Sign in
function signIn(){
    const email=document.getElementById('email-in').value
    const password=document.getElementById('pass-in').value
    if (email.length<5 || email.indexOf('@')==-1){
        alert("Enter a valid email!")
        return
    }else if(password.length<3){
        alert("Enter a valid password!")
        return
    }
    else{
        document.getElementById('email-in').value=""
        document.getElementById('pass-in').value=""
    }
    let creds={
        email: email,
        password:password
    }
    axios({
        method: 'get',
        url: `${UserUrl}/${JSON.stringify(creds)}`,
    }).then(response=>{
        console.log(response)
        if (response.data.code==2){
            alert("You have entered an Invalid Password!")
        }else if(response.data.code==0){
            alert("Your email is not registered with us!")
        }else if(response.data.code==1){
            alert("Sign In Successful!")
            sessionStorage.setItem('auth', JSON.stringify({token:response.data.token}))
            location.replace('./index.html')
        }
    }).catch(err=>console.log(err))
}

//Check if already Logged In
var state;
function checkAuthState(){
    state=JSON.parse(sessionStorage.getItem('auth'))
    if (state==null||state==undefined||state==''){
        return
    }else if(state.token){
        location.replace('./index.html')
    }else{
        return
    }
}

checkAuthState()

// Forgot Password
function forgotPassword(){
    forgotBtn.style.display='none'
    signInBtn.removeEventListener('click', signIn)
    signInBtn.innerHTML="Reset Password"
    signInBtn.addEventListener('click', sendResetMail)
    document.getElementById('pass-in').style.display='none'
}

function sendResetMail(){
    let email=document.getElementById('email-in').value
    if(email.indexOf('@')==-1){
        alert("Enter a valid Email!")
    }
    axios({
        method: 'get',
        url: `${forgotPassUrl}${email}`
    }).then(response=>{
        if(response.data.sent==true){
            alert("Password Reset Mail has been sent!")
            location.reload()
        }
    }).catch(err=>console.log(err))
}
