import db from "../banco.js";



const verificarGrupo = (req, res, next) => {
    //console.log('req.user.id, req.user.id', req.user.id); // Verifique se o ID do usuário está presente
    const usuario = db.prepare("SELECT * FROM Usuarios WHERE id = ?").get(req.user.id);
    //console.log('usuario', usuario); // Verifique se o usuário foi encontrado no banco de dados

    if (!usuario || !usuario.grupo_id) {
        return res.status(403).json({ error: "Você precisa estar em um grupo." });
    }
    req.usuario = usuario; // Armazena o usuário autenticado na requisição
    next();

}

export default verificarGrupo;