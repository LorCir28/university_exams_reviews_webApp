const express = require("express");
const multer = require("multer");
var bodyParser = require("body-parser")
const fs = require("fs");

const app = express();
const upload = multer();

// middlewares
app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended:true }))


//pagine principali
app.get("/", (req, res) => {
    res.sendFile("homepage.html", {root: __dirname + "/../../frontend/public/"});
})
app.get("/welcome", (req, res) => {
    res.sendFile("welcome.html", {root: __dirname + "/../../frontend/public/"});
})

//stili CSS usati
app.get("/css",(req,res)=>{
    res.sendFile("styleHomepage.css", {root: __dirname + "/../../frontend/public/styles"});
})

app.get("/cssResponsive",(req,res)=>{
    res.sendFile("styleResponsive.css", {root: __dirname + "/../../frontend/public/styles"});
})

app.get("/cssExams",(req,res)=>{
    res.sendFile("styleExams.css", {root: __dirname + "/../../frontend/public/styles"});
})
app.get("/cssResponsive",(req,res)=>{
    res.sendFile("styleResponsive.css", {root: __dirname + "/../../frontend/public/styles"});
})

app.get("/cssForm", (req, res) => {
    res.sendFile("styleForm.css", {root: __dirname + "/../../frontend/public/styles"});
})

app.get("/img1",(req,res)=>{
    res.sendFile("svg1.svg", {root: __dirname + "/../../frontend/img/"});
})

app.get("/img2",(req,res)=>{
    res.sendFile("svg2.svg", {root: __dirname + "/../../frontend/img/"});
})

app.get("/img3",(req,res)=>{
    res.sendFile("svg3.svg", {root: __dirname + "/../../frontend/img/"});
})

app.get("/img4",(req,res)=>{
    res.sendFile("svg4.svg", {root: __dirname + "/../../frontend/img/"});
})

//pagine degli esami
app.get("/exams", (req, res) => {
    res.sendFile("index.html", {root: __dirname + "/../../frontend/public/esami"})
})

app.get("/exams/programmazioneC", (req, res) => {
    res.sendFile("programmazioneC.html", {root: __dirname + "/../../frontend/public/esami"})
})

app.get("/exams/machineLearning", (req, res) => {
    res.sendFile("machineLearning.html", {root: __dirname + "/../../frontend/public/esami"})
})

app.get("/exams/geometriaEuclidea", (req, res) => {
    res.sendFile("geometriaEuclidea.html", {root: __dirname + "/../../frontend/public/esami"})
})

app.get("/exams/economiaAvanzata", (req, res) => {
    res.sendFile("economiaAvanzata.html", {root: __dirname + "/../../frontend/public/esami"})
})

app.get("/exams/disegnoTecnico", (req, res) => {
    res.sendFile("disegnoTecnico.html", {root: __dirname + "/../../frontend/public/esami"})
})

app.get("/exams/chimica", (req, res) => {
    res.sendFile("chimica.html", {root: __dirname + "/../../frontend/public/esami"})
})

app.get("/exams/bigDataEngineering", (req, res) => {
    res.sendFile("bigDataEngineering.html", {root: __dirname + "/../../frontend/public/esami"})
})

app.get("/exams/analisiMatematica3", (req, res) => {
    res.sendFile("analisiMatematica3.html", {root: __dirname + "/../../frontend/public/esami"})
})


//form di registrazione e login


app.get("/registration", (req, res) => {
    res.sendFile("registration.html", {root: __dirname + "/../../frontend/public/forms"})
})
app.get("/login", (req, res) => {
    res.sendFile("login.html", {root: __dirname + "/../../frontend/public/forms"})
})
app.get("/redirect-registration", (req, res) => {
    res.sendFile("redirectRegistration.html", {root: __dirname + "/../../frontend/public/forms"})
})
app.get("/redirect-login", (req, res) => {
    res.sendFile("redirectLogin.html", {root: __dirname + "/../../frontend/public/forms"})
})
app.get("/redirect-psw-missed-login", (req, res) => {
    res.sendFile("redirectPswMissedLogin.html", {root: __dirname + "/../../frontend/public/forms"})
})

//scrittura delle recensioni

app.get("/exams/scrivi-recensione", (req, res) => {
    res.sendFile("recensioni.html", {root: __dirname + "/../../frontend/public/forms"})
})

const client = require("./database/connection");
client.connect();

let matr;

app.post("/validate-registration", upload.none(), (req, res) => {
    console.log(req.body);

    const {email} = req.body;
    const {password} = req.body;
    const {name} = req.body;
    const {surname} = req.body;
    const {matricola} = req.body;

    let data;


    client.query(`Select * from users`).then(result => {
        data = result.rows;
        // console.log(data);

        if (data.length == 0) {
            console.log(("UTENTE NON REGISTRATO... LO INSERIAMO SUBITO..."));
                client.query(`INSERT INTO users(email, password, name, surname, matricola)values('${email}', '${password}', '${name}', '${surname}', '${matricola}')`).then(result => {
                    console.log("UTENTE REGISTRATO");


                    matr = matricola;


                    var data = fs.readFileSync('../frontend/public/welcome.html').toString().split("\n");
                    data.splice(30, 1, '<h1>Ciao <span>' + name + '</span></h1>');
                    var text = data.join("\n");
                    fs.writeFileSync("../frontend/public/welcome.html", text);

                    res.redirect("http://localhost:5000/welcome");


                })
        }

        for (let i = 0; i < data.length; i++) {
            if (email === data[i].email) {
                console.log("UTENTE GIA' REGISTRATO");
                res.redirect("http://localhost:5000/redirect-login")
                break;
            }
            else if (i == data.length -1 ) {
                console.log(("UTENTE NON REGISTRATO... LO INSERIAMO SUBITO..."));
                client.query(`INSERT INTO users(email, password, name, surname, matricola)values('${email}', '${password}', '${name}', '${surname}', '${matricola}')`).then(result => {
                    console.log("UTENTE REGISTRATO");

                    matr = matricola;

                    var data = fs.readFileSync('../frontend/public/welcome.html').toString().split("\n");
                    data.splice(30, 1, '<h1>Ciao <span>' + name + '</span></h1>');
                    var text = data.join("\n");
                    fs.writeFileSync("../frontend/public/welcome.html", text);


                    res.redirect("http://localhost:5000/welcome");
                })
            }
        }
    })

})

app.post("/validate-login", upload.none(), (req, res) => {
    console.log(req.body);

    const {email} = req.body;
    const {password} = req.body;

    let data;


    client.query(`Select * from users`).then(result => {
        data = result.rows;
        // console.log(data);

        if (data.length == 0) {
            console.log("UTENTE NON REGISTRATO");
            res.redirect("http://localhost:5000/redirect-registration");

        }

        for (let i = 0; i < data.length; i++) {
            if (email === data[i].email) {
                if (password === data[i].password) {

                    client.query(`Select name from users where email = '${email}'`).then(result => {
                        data = result.rows;
                        // console.log(data);
                        let nome = data[0].name;

                        var dati = fs.readFileSync('../frontend/public/welcome.html').toString().split("\n");
                        dati.splice(30, 1, '<h1>Rieccoti <span>' + nome + '</span></h1>');
                        var text = dati.join("\n");
                        fs.writeFileSync("../frontend/public/welcome.html", text);
                    })


                    client.query(`Select matricola from users where email = '${email}'`).then(result => {
                        data = result.rows;
                        // console.log(data);
                        matr = data[0].matricola;
                    })
                        
                    

                    res.redirect("http://localhost:5000/welcome");
                    break;
                }
                else {
                    console.log("PASSWORD ERRATA");
                    res.redirect("http://localhost:5000/redirect-psw-missed-login");

                    break;
                }
            }
            else if (i == data.length -1 ) {
                console.log("UTENTE NON REGISTRATO");
                res.redirect("http://localhost:5000/redirect-registration");
                
            }
        }
    })
})
        




app.post("/exams/scrivi-recensione", upload.none(), (req,res,next) => {
    console.log(req.body);
    console.log("MATRICOLA: " + matr);
    var titolorecensione="<br><h1>Recensione dell'utente "+matr+":</h1>";
    var testorecensione="<br><p>" + req.body.recensione + "</p>";
    // res.send(req.body);

    const esameScelto = req.body.exam;
    if (esameScelto === "programmazioneC") {

        var data = fs.readFileSync('../frontend/public/esami/programmazioneC.html').toString().split("\n");
        data.splice(116, 0, titolorecensione+testorecensione);
        var text = data.join("\n");

        fs.writeFileSync('../frontend/public/esami/programmazioneC.html', text);

        //test

    }
    else if (esameScelto === "machineLearning") {
        var data = fs.readFileSync('../frontend/public/esami/machineLearning.html').toString().split("\n");
        data.splice(116, 0, titolorecensione+testorecensione);
        var text = data.join("\n");
        fs.writeFileSync("../frontend/public/esami/machineLearning.html", text);
    }
    else if (esameScelto === "geometriaEuclidea") {
        var data = fs.readFileSync('../frontend/public/esami/geometriaEuclidea.html').toString().split("\n");
        data.splice(116, 0, titolorecensione+testorecensione);
        var text = data.join("\n");
        fs.writeFileSync("../frontend/public/esami/geometriaEuclidea.html", text);
    }
    else if (esameScelto === "economiaAvanzata") {
        var data = fs.readFileSync('../frontend/public/esami/economiaAvanzata.html').toString().split("\n");
        data.splice(116, 0, titolorecensione+testorecensione);
        var text = data.join("\n");
        fs.writeFileSync("../frontend/public/esami/economiaAvanzata.html", text);
    }
    else if (esameScelto === "disegnoTecnico") {
        var data = fs.readFileSync('../frontend/public/esami/disegnoTecnico.html').toString().split("\n");
        data.splice(116, 0, titolorecensione+testorecensione);
        var text = data.join("\n");
        fs.writeFileSync("../frontend/public/esami/disegnoTecnico.html", text);
    }
    else if (esameScelto === "chimica") {
        var data = fs.readFileSync('../frontend/public/esami/chimica.html').toString().split("\n");
        data.splice(116, 0, titolorecensione+testorecensione);
        var text = data.join("\n");
        fs.writeFileSync("../frontend/public/esami/chimica.html", text);
    }
    else if (esameScelto === "bigDataEngineering") {
        var data = fs.readFileSync('../frontend/public/esami/bigDataEngineering.html').toString().split("\n");
        data.splice(116, 0, titolorecensione+testorecensione);
        var text = data.join("\n");
        fs.writeFileSync("../frontend/public/esami/bigDataEngineering.html", text);
    }
    else if (esameScelto === "analisiMatematica3") {
        var data = fs.readFileSync('../frontend/public/esami/analisiMatematica3.html').toString().split("\n");
        data.splice(116, 0, titolorecensione+testorecensione);
        var text = data.join("\n");
        fs.writeFileSync("../frontend/public/esami/analisiMatematica3.html", text);
    }


    res.redirect("http://localhost:5000/exams/" + req.body.exam);

})
       










app.listen(5000, () => console.log("server is listening on port 5000..."))
