import db from "../banco.js";



const verificarGrupo = (req, res, next) => {
    const usuario = db.prepare("SELECT * FROM usuarios WHERE id = ?").get(req.user.id);

    if (usuario.grupo_id) {
        next();
} else {
    return res.status(403).json({ error: "Você precisa estar em um grupo." });
 }
}

export default verificarGrupo;