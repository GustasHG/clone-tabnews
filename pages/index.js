export default function Home() {
  function teste() {
    console.log("Aoba");
  }
  return (
    <section>
      <h1> Isso é pra dar erro, não? </h1>
      <div>Tabela de test:</div>
      <table>
        <thead>
          <tr>
            <th>Dado 1</th>
            <th>Dado 2</th>
            <th>Dado 3</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td> Valor (1) </td>
            <td> Valor (2) </td>
            <td> Valor (3) </td>
          </tr>
        </tbody>
      </table>
    </section>
  );
}
