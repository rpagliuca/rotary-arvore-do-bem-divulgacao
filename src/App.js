import { React } from 'react';
import * as rs from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css';
import arte1 from './img/arte1.jpg';
import arte2 from './img/arte2.jpg';
import arte3 from './img/arte3.jpg';
import arte4 from './img/arte4.jpg';
import arte5 from './img/arte5.jpg';
import arte6 from './img/arte6.jpg';
import arte7 from './img/arte7.jpg';
import arte8 from './img/arte8.png';

function App() {

  const themes = [
    ["#941F1F", "white"],
    ["#7B9971", "white"],
    ["#CE6B5D", "white"],
    ["#FFEFB9", "black"],
    ["#34502B", "white"]
  ]
  let currentThemeIndex = 0

  const cycleTheme = () => {
    return themes[currentThemeIndex++ % themes.length]
  }

  return (
    <>
    <rs.Container>

      <h1 style={{color: cycleTheme()[0]}}>Árvore do Bem</h1>
      <h3 style={{color: cycleTheme()[0]}}>Sua ajuda na divulgação é (muuuito) importante!</h3>

      <rs.Row>

        <MyCard theme={cycleTheme()} title="Arte 1" imageSrc={arte8}></MyCard>
        <MyCard theme={cycleTheme()} title="Arte 2" imageSrc={arte2}></MyCard>
        <MyCard theme={cycleTheme()} title="Arte 3" imageSrc={arte3}></MyCard>
        <MyCard theme={cycleTheme()} title="Arte 4" imageSrc={arte4}></MyCard>
        <MyCard theme={cycleTheme()} title="Arte 5" imageSrc={arte5}></MyCard>
        <MyCard theme={cycleTheme()} title="Arte 6" imageSrc={arte6}></MyCard>
        <MyCard theme={cycleTheme()} title="Arte 7" imageSrc={arte7}></MyCard>
        <MyCard theme={cycleTheme()} title="Arte 8" imageSrc={arte1}></MyCard>

        <MyCard theme={cycleTheme()} title="Instruções básicas">
          <br/>
          * Link oficial da campanha: www.arvoredobemcotia.com.br<br/><br/>
          * Doação mínima: R$25 (limite imposto pela plataforma Vakinha)<br/><br/>
          * Data limite para doação: 18/12/2020<br/><br/>
        </MyCard>

        <MyCard theme={cycleTheme()} subtitle="Está sem criatividade? Copie e compartilhe o texto abaixo." title="Texto básico para compartilhamento">
          Distribua alegria neste Natal!
          www.arvoredobemcotia.com.br
        </MyCard>

        <MyCard theme={cycleTheme()}  title="Dica 1" subtitle="Abuse das redes sociais">Compartilhe as artes do projeto em todas as suas redes sociais: Whatsapp, Instagram, Facebook.</MyCard>
        <MyCard theme={cycleTheme()}  title="Dica 2" subtitle="Faça rodízio das artes">Você pode fazer novas publicações diariamente, ou na frequência que preferir. Para aumentar o dinamismo e engajamento, alterne na utilização das artes.</MyCard>
        <MyCard theme={cycleTheme()}  title="Dica 3" subtitle="Mensagem direta">Em todas as redes sociais, envie mensagem direta para amigos e familiares mais próximos explicando um pouquinho sobre o projeto.</MyCard>
        <MyCard theme={cycleTheme()}  title="Dica 4" subtitle="Instagram - Link clicável">Para gerar um link clicável no Instagram, primeiro adicione o link do projeto na sua bio. Em seguida, publique um post (ou story) e explique: "Link na bio". <a href="https://www.uol.com.br/tilt/noticias/redacao/2018/08/30/link-na-bio-saiba-o-que-significa-e-como-utilizar-o-truque-no-instagram.htm" target="_blank">Saiba mais</a>.</MyCard>
        <MyCard theme={cycleTheme()}  title="Dica 5" subtitle="Instagram - Stories">Personalize com GIFs, emoticons e outros toques pessoais para aumentar o dinamismo e engajamento.</MyCard>
        <MyCard theme={cycleTheme()}  title="Dica 6" subtitle="Whatsapp - Grupos que você administra">Em grupos do Whatsapp que você administra, você podeadicionar o nome do projeto como prefixo do nome do grupo, e assimpara fazer uma divulgação permanente. Exemplo: se altere nome do grupo "Moradores do Bloco D" para "[Árvore do Bem] Moradores do Bloco D". <a href="https://canaltech.com.br/apps/aprenda-a-trocar-o-nome-ou-assunto-de-grupos-do-whatsapp/" target="_blank">Saiba mais</a>.</MyCard>
        <MyCard theme={cycleTheme()}  title="Dica 7" subtitle="Whatsapp - Outros grupos">Compartilhe as artes juntamente com um texto personalizado de sua autoria, contextualizando o projeto, e preferencialmente em horário que o grupo esteja menos ativo.</MyCard>
        <MyCard theme={cycleTheme()}  title="Dica 8" subtitle="Whatsapp - Status">Publique dois "status" diferentes, um seguido do outro. O primeiro status contendo apenas a arte, e o segundo contendo o link. Coloque o link dentro da foto, e não na legenda.</MyCard>

        </rs.Row>
      </rs.Container>
    </>
  );
}

const MyCard = (props) => {
  const theme = props.theme || ["white", "black"]
  return (
    <rs.Col md="4" style={{marginTop: 10, marginBottom: 10}} className="d-flex">
      <rs.Card style={{background: theme[0], color: theme[1]}}>
        { props.imageSrc && <a href={props.imageSrc} target="_blank" rel="noreferrer"><rs.CardImg top width="100%" src={props.imageSrc} /></a> }
        <rs.CardBody className="flex-fill">
          <rs.CardTitle tag="h5">{props.title}</rs.CardTitle>
          <rs.CardSubtitle style={{color: theme[1], fontStyle: "italic", opacity: 0.5}} className="mb-2">{props.subtitle}</rs.CardSubtitle>
          <hr/>
          <rs.CardText style={{opacity: 0.9}}>{props.children}</rs.CardText>
        </rs.CardBody>
      </rs.Card>
    </rs.Col>
  )
}

export default App;
