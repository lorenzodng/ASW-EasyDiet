import * as service from "./service.js";

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

export const deleteDietInfoController = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        status: false,
        message: "UserId mancante"
      });
    }

    const diet = await service.deleteDietByUserId(userId);

    if (!diet) {
      return res.status(404).json({
        status: false,
        message: "Nessuna dieta trovata per questo utente"
      });
    }

    return res.status(200).json({
      status: true,
      message: "Dieta eliminata con successo",
      data: diet
    });

  } catch (error) {
    console.error("Errore eliminazione dieta:", error);
    return res.status(500).json({
      status: false,
      message: "Errore server nell'eliminazione della dieta"
    });
  }
};

// Chat with LLM for diet generation
export const chatController = async (req, res) => {
  const messages = JSON.parse(req.query.messages || "[]");
  let lastMsg = "";
  if (messages.length > 0 && messages[messages.length - 1].content) { // Get the last user message
    lastMsg = messages[messages.length - 1].content;
  }

  if (!service.validateMessage(lastMsg)) { // Validate that the message is diet-related
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    res.write(`data: ${JSON.stringify({ role: "assistant", content: "Posso aiutarti solo con domande su dieta, nutrizione e pasti. 😊" })}\n\n`);
    res.write(`event: end\ndata: [DONE]\n\n`);
    res.end();
    return;
  }

  try {
    // Set headers for SSE streaming
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    // Generate response as async stream
    const stream = service.generateChatResponse(messages);

    // Send tokens one by one to the client
    for await (const token of stream) {
      res.write(`data: ${JSON.stringify({ role: "assistant", content: token })}\n\n`);
    }

    // Signal end of stream
    res.write(`event: end\ndata: [DONE]\n\n`);
    res.end();
  } catch (err) {
    console.error("Errore LLM:", err);
    res.status(500).json({ error: "Errore interno" });
  }
};