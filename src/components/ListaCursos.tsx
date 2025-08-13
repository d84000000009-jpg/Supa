import React from "react";

const ListaCursos = () => {
  const cursos = [
    { id: 1, nome: "Curso de React", categoria: "Front-end", vagas: 20 },
    { id: 2, nome: "Curso de Node.js", categoria: "Back-end", vagas: 15 },
    { id: 3, nome: "Curso de UX/UI", categoria: "Design", vagas: 10 },
  ];

  return (
    <div className="mt-6 p-6 bg-gray-900 rounded-xl shadow-lg text-white">
      <h2 className="text-2xl font-bold mb-4">Lista de Cursos</h2>

      <table className="min-w-full text-sm">
        <thead>
          <tr className="bg-gray-800 text-left text-gray-300">
            <th className="py-2 px-4">ID</th>
            <th className="py-2 px-4">Nome</th>
            <th className="py-2 px-4">Categoria</th>
            <th className="py-2 px-4">Vagas</th>
          </tr>
        </thead>
        <tbody>
          {cursos.map((curso) => (
            <tr key={curso.id} className="hover:bg-gray-700">
              <td className="py-2 px-4">{curso.id}</td>
              <td className="py-2 px-4">{curso.nome}</td>
              <td className="py-2 px-4">{curso.categoria}</td>
              <td className="py-2 px-4">{curso.vagas}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListaCursos;
