//controller che gestisce le richieste sulle diete

import * as service from "./service.js";

//salvataggio della dieta
export const saveDietController = async (req, res) => {
  try {
    const dietData = req.body;
    const result = await service.saveDiet(dietData);

    if (result.status) {
      res.send({
        status: true,
        message: "Dieta salvata con successo"
      });
    } else {
      res.send({
        status: false,
        message: result.message
      });
    }
  } catch (err) {
    console.error(err);
    res.send({
      status: false,
      message: "Errore nel salvataggio della dieta"
    });
  }
};

//recupero della dieta dell'utente
export const getDietInfoController = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        status: false,
        message: "UserId mancante"
      });
    }

    const diet = await service.getDietByUserId(userId);

    if (!diet) {
      return res.status(404).json({
        status: false,
        message: "Nessuna dieta trovata per questo utente"
      });
    }

    return res.status(200).json({
      status: true,
      data: diet
    });

  } catch (error) {
    console.error("Errore recupero dieta:", error);
    return res.status(500).json({
      status: false,
      message: "Errore server nel recupero della dieta"
    });
  }
};

//chat con LLM per la generazione della dieta
export const chatController = async (req, res) => {
  const messages = JSON.parse(req.query.messages || "[]");
  let lastMsg = "";
  if (messages.length > 0 && messages[messages.length - 1].content) { //prende l'ultimo messaggio inviato dall'utente
    lastMsg = messages[messages.length - 1].content;
  }

  if (!service.validateMessage(lastMsg)) { //verifica che l'ultimo messaggio è pertinente
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    res.write(`data: ${JSON.stringify({ role: "assistant", content: "Posso aiutarti solo con domande su dieta, nutrizione e pasti. 😊" })}\n\n`);
    res.write(`event: end\ndata: [DONE]\n\n`);
    res.end();
    return;
  }

  try {
    //imposta header per streaming SSE
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    //genera la risposta come generator async
    const stream = service.generateChatResponse(messages);

    for await (const token of stream) {
      //invia ogni token al frontend
      res.write(`data: ${JSON.stringify({ role: "assistant", content: token })}\n\n`);
    }

    //indica la fine dello stream
    res.write(`event: end\ndata: [DONE]\n\n`);
    res.end();
  } catch (err) {
    console.error("Errore LLM:", err);
    res.status(500).json({ error: "Errore interno" });
  }
};