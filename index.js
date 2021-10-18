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

app.listen(3000, (req, res) => {
    console.log("Servidor rodando");
});