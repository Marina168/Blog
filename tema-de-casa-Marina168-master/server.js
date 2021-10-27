const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');
const app = express();
const port = 7777;
const con =  require('./DBconnection')
con.createConn();  
var path = require('path');
var fs=require('fs');
var $ = require( "jquery" );
const cookieParser = require('cookie-parser');
const session = require('express-session');
app.use(cookieParser());
app.use(session({
	username:'marina',
	password:'ina',
	mesaj:null,
	resave: true,
    saveUninitialized: true,
	secret: 'jghy',
	
}));


// directorul 'views' va conține fișierele .ejs (html + js executat la server)
app.set('view engine', 'ejs');
// suport pentru layout-uri - implicit fișierul care reprezintă template-ul site-ului este views/layout.ejs
app.use(expressLayouts);
// directorul 'public' va conține toate resursele accesibile direct de către client (e.g., fișiere css, javascript, imagini)
app.use(express.static(path.join(__dirname, 'public')));
//app.use(express.static('public'));
// corpul mesajului poate fi interpretat ca json; datele de la formular se găsesc în format json în req.body
app.use(bodyParser.json());
// utilizarea unui algoritm de deep parsing care suportă obiecte în obiecte
app.use(bodyParser.urlencoded({ extended: true }));

// la accesarea din browser adresei http://localhost:6789/ se va returna textul 'Hello World'
// proprietățile obiectului Request - req - https://expressjs.com/en/api.html#req
// proprietățile obiectului Response - res - https://expressjs.com/en/api.html#res

app.get('/',(req,res)=>
{
    res.render('acasa.ejs');
})

app.get('/idei',async (req, res) => {
	con.createTable();
	var results = await con.getAllComments();
	if(req.session.username !== 0)
	{
		res.render('idei',{username : req.session.username,errorMsg : req.session.mesaj});
	}
	app.get('/commentPage',(req,res)=>
	{
		res.render('commentPage',{results:JSON.parse(JSON.stringify((results)))});
	})

   
});
app.get('/aventuri',(req,res)=>
{
	res.render('aventuri');
})
app.get('/carti',(req,res)=>
{
	res.render('carti');
})
app.get('/filme',(req,res)=>
{
    res.render('filme.ejs');
})
app.post('/idei', async (req, res) => {
	con.insertComment(req.body.firstname,req.body.subject);
	res.json({message:"succes"});
});;
app.post('/verifica-autentificare',(req, res)=>
{

	var users = [];
	fs.readFile("utilizatori.json",(err,data)=>
	{
		if(err)throw err;
		users = JSON.parse(data);
		
		for(let index=0;index<users.length;++index)
		{
			

			if(req.body.username === users[index].username)
			{
				if(req.body.password === users[index].password)
				{
                    req.session.username= req.body.username;
                    console.log(req.session.username);
					req.session.mesaj=undefined;
					res.redirect(302,'/commentPage')
					return;
				}
				else{
					req.session.mesaj="Parola este gresita";
					res.redirect(302,"/idei")
					return ;
				}		
			}
		}
		req.session.mesaj="Utilizatorul nu este corect!";
		res.redirect(302,"/idei");
		
	});
});


app.listen(port, () => console.log(`Serverul rulează la adresa http://localhost:`));
