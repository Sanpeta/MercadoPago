const express = require("express");
const MercadoPago = require("mercadopago");
const app = express();

MercadoPago.configure({
    sandbox: true,
    access_token: "TEST-6876893408527582-101802-ed2a475eccf3145b3016e32c1a0c2da9-17165112"
});
// Public Key
// TEST-1b4ea93d-8414-4a8e-854d-56de2cdfca16

app.get("/", (req, res) => {
    res.send("Olá Mundo");
});

app.get("/pagar", async (req, res) => {

    //Pagamentos
    //id // codigo // pagador // status
    //1 // 1231231231231 // sidneisonic@hotmail.com // Pago
    //2 // aa1231231231231 // sidneisonic2@hotmail.com // Não Pago

    var id = ""+Date.now()

    var dados = {
        items: [
            item = {
                id: id,
                title: "2x videos games, 3x camisas",
                quantity: 1,
                currency_id: 'BRL',
                unit_price: parseFloat(150)
            }
        ],
        payer: {
            email: "sidneidesouzajunior@gmail.com"
        },
        external_reference: id
    }

    try {
        var pagamento = await MercadoPago.preferences.create(dados);
        console.log(pagamento);
        //Salvar no banco de dados
        // Banco.SalvarPagamento({id: id, pagador: emailDoPagador});
        return res.redirect(pagamento.body.init_point);
    } catch (error) {
        console.log(error)
        return res.send(error.message);
    }

});

app.post("/not", (req, res) => {
    //receber uma id de notificacao IPN
    var id = req.query.id;

    setTimeout(() => {
        var filtro = {
            "order.id": id
        }

        MercadoPago.payment.search({
            qs: filtro
        }).then(data => {
            var pagamento = data.body.results[0];
            if(pagamento != undefined) {
                console.log(pagamento);
                console.log(pagamento.external_reference);
                console.log(pagamento.status);
                if(pagamento.status  == "approved") {
                    Banco.definirComoPago(pagamento.external_reference);
                }
            } else {
                console.log("Pagamento não existe");
            }
            console.log(data);
        }).catch(err => {
            console.log(err);
        })
    }, 20000);

    res.sendStatus(200);
    res.send("OK");
})

app.listen(4400, (req, res) => {
    console.log("Servidor rodando");
});
