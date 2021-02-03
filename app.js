const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require("body-parser");

require('./models/article');
const Artigo = mongoose.model('artigo');

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static("public"));

app.use((req, res, next) => {
    console.log("Middleware acessado!");
    res.header("Acess-Control-Allow-Origin", "*")
    app.use(cors());
    next();
});

mongoose.connect('mongodb://localhost/mestre', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
}).then(() => {
    console.log('conexão com mongo realizada numa boa');
}).catch((error) => {
    console.log('Erro: conexão com mongo não realizada numa boa')
});

/*app.set('view engine', 'ejs')

app.get("/", (req, res) => {

    var today = new Date();

    var options = {
        weekday: "long", 
        day: "numeric",
        month: "long",
        year: "numeric"
    };

    var day = today.toLocaleDateString("pt-BR", options).toUpperCase();

    post = [];

    article = Artigo.findOne({
        _titulo: req.params.titulo
    }).then((artigo) => {
        return post = res.send.json(artigo);
    }).catch((erro) => {
        return res.status(400).json({
            error: true,
            message: "Nenhum artigo encontrado"
        });
    });

    res.render("page", {kindOfDay: day, searchTitle: post});  

});*/

app.get("/artigo/:id", (req, res) => {
    console.log(req.params.id);

    Artigo.findOne({
        _id: req.params.id
    }).then((artigo) => {
        return res.json(artigo);
    }).catch((erro) => {
        return res.status(400).json({
            error: true,
            message: "Nenhum artigo encontrado"
        });
    });

});

app.post('/artigo', (req, res) => {  
    const artigo = Artigo.create(req.body, (err) => {
        if (err) return res.status(400).json({
            error: true,
            message: "Error: Impossível realizar o cadastro"
        });

        if (err != true)  return res.status(200).json({
            error: false,
            message: "Cadastro Realizado"
        })
    }); 

});

app.put("/artigo/:id", (req, res) => {
    const artigo = Artigo.updateOne({_id: req.params.id}, req.body, (err) => {
        if (err) return res.status(400).json({
            error: true,
            message: "Artigo não editado com sucesso"
        })

        return res.json({
            error: false,
            message: "Artigo editado com sucesso"
        });
    });
});

app.delete("/artigo/:id", (req, res) => {
    const artigo = Artigo.deleteOne({_id: req.params.id}, (err) => {
        if (err) return res.status(400).json({
            error: true,
            message: "Artigo não apagado"
        })

        return res.json({
            error: false,
            message: "Artigo apagado com sucesso"
        });

        
    });

});

app.listen(process.env.PORT || 3000, function() {
    console.log("Server Working");
});