// Configurações dos campos reproduzem as perguntas da ficha oficial.
const medical = [
  {id:'medicamento',title:'Está tomando algum medicamento?',options:['Sim','Não'],detail:'Se sim, qual(is)?',x:[476,578],y:980,detailBox:[788,946,1015,35],wide:true},
  {id:'pressao',title:'Sua pressão é:',options:['Normal','Alta','Baixa','Controlada com medicamento'],x:[311,419,529,839],y:1025,wide:true},
  {id:'hemorragia',title:'Problemas com sangue/hemorragia?',options:['Sim','Não'],x:[472,568],y:1077},
  {id:'anestesicos',title:'Tem ou teve problemas com anestésicos?',options:['Sim','Não','Não sei'],x:[512,608,726],y:1126},
  {id:'psicologico',title:'Faz algum tratamento psicológico?',options:['Sim','Não'],x:[452,550],y:1176},
  {id:'quimio',title:'Já fez ou faz algum tratamento com quimioterapia ou radioterapia?',options:['Sim','Não'],x:[735,833],y:1225,wide:true},
  {id:'cirurgia',title:'Já fez alguma cirurgia?',options:['Sim','Não'],x:[350,448],y:1275},
  {id:'necessidades',title:'Portador(a) de necessidades especiais?',options:['Sim','Não'],detail:'Se sim, qual(is)?',x:[509,605],y:1326,detailBox:[900,1317,880,34],wide:true},
  {id:'dentista',title:'Com que frequência vai ao dentista?',options:['Semestral','Anual','Quando tenho alguma queixa','Outra'],detail:'Se outra, qual?',x:[548,649,955,1050],y:1375,detailBox:[1100,1368,677,34],wide:true},
  {id:'cronica',title:'Você tem alguma doença crônica?',options:['Sim','Não'],x:[446,544],y:1425},
  {id:'respiratorios',title:'Asma ou problemas respiratórios?',options:['Sim','Não'],x:[445,543],y:1475},
  {id:'anemia',title:'Você tem anemia?',options:['Sim','Não'],x:[305,404],y:1525},
  {id:'desmaios',title:'Você tem desmaios/convulsões?',options:['Sim','Não'],x:[435,533],y:1575},
  {id:'transmissivel',title:'Você tem alguma doença transmissível?',options:['Sim','Não'],x:[501,599],y:1627}
];
const habits = [
  {id:'range',title:'Range os dentes?',options:['Sim','Não'],x:[350,420],y:1729},
  {id:'escovacoes',title:'Quantas vezes você escova os dentes ao dia?',input:true,box:[1328,1701,455,44]},
  {id:'fumante',title:'Você é fumante?',options:['Sim','Não'],x:[320,419],y:1794},
  {id:'gravida',title:'Você está grávida?',options:['Sim','Não'],x:[1178,1276],y:1794},
  {id:'diabete',title:'Você tem diabetes?',options:['Sim','Não'],x:[320,419],y:1861},
  {id:'alcool',title:'Você faz uso de bebida alcoólica?',options:['Sim','Não'],x:[1314,1412],y:1861}
];

// Desenha os controles mantendo cada grupo de respostas independente.
function mountQuestions(items,container){
  container.innerHTML=items.map(q=>`<div class="question ${q.wide?'wide':''}"><span class="question-title">${q.title}</span>${q.input?`<input name="${q.id}" inputmode="numeric" type="number" min="0" max="20" placeholder="Quantidade por dia">`:`<div class="choice-row" role="group" aria-label="${q.title}">${q.options.map(o=>`<label class="choice"><input type="radio" name="${q.id}" value="${o}"><span>${o}</span></label>`).join('')}</div>`}${q.detail?`<input class="detail-input" name="${q.id}_detail" maxlength="120" placeholder="${q.detail}">`:''}</div>`).join('');
}
mountQuestions(medical,document.querySelector('#medical-questions'));
mountQuestions(habits,document.querySelector('#habit-questions'));

// Máscaras ajudam o preenchimento sem afetar os valores armazenados no PDF.
document.querySelectorAll('[data-mask]').forEach(input=>input.addEventListener('input',()=>{
  const digits=input.value.replace(/\D/g,'');
  if(input.dataset.mask==='cpf')input.value=digits.slice(0,11).replace(/^(\d{3})(\d)/,'$1.$2').replace(/^(\d{3})\.(\d{3})(\d)/,'$1.$2.$3').replace(/\.(\d{3})(\d{1,2})$/,'.$1-$2');
  if(input.dataset.mask==='cep')input.value=digits.slice(0,8).replace(/^(\d{5})(\d)/,'$1-$2');
  if(input.dataset.mask==='phone'){const d=digits.slice(0,11);input.value=d.length>2?`(${d.slice(0,2)}) ${d.slice(2,d.length>10?7:6)}${d.length>6?'-'+d.slice(d.length>10?7:6):''}`:d;}
}));

// Consulta o ViaCEP quando os oito dígitos forem informados e mantém os campos editáveis.
const cepInput=document.querySelector('[name="cep"]');
const cepStatus=document.querySelector('#cep-status');
let lastCep='';
async function fillAddressFromCep(){
  const cep=cepInput.value.replace(/\D/g,'');
  if(cep.length!==8){cepStatus.textContent='';return;}
  if(cep===lastCep)return;
  cepStatus.textContent='Buscando endereço...';cepInput.setAttribute('aria-busy','true');
  try{
    const response=await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    if(!response.ok)throw new Error('Falha na consulta');
    const address=await response.json();
    if(address.erro){lastCep='';cepStatus.textContent='CEP não encontrado.';return;}
    const fieldMap={endereco:address.logradouro,bairro:address.bairro,cidade:address.localidade,uf:address.uf};
    Object.entries(fieldMap).forEach(([name,value])=>{if(value)form.elements[name].value=value;});
    lastCep=cep;cepStatus.textContent='Endereço preenchido automaticamente.';
    const firstEmpty=['endereco','bairro','cidade','uf'].find(name=>!form.elements[name].value);
    if(firstEmpty)form.elements[firstEmpty].focus();
  }catch(error){lastCep='';cepStatus.textContent='Não foi possível consultar o CEP. Preencha o endereço manualmente.';}
  finally{cepInput.removeAttribute('aria-busy');}
}
cepInput.addEventListener('blur',fillAddressFromCep);
cepInput.addEventListener('input',()=>{if(cepInput.value.replace(/\D/g,'').length===8)fillAddressFromCep();});

// As coordenadas abaixo são medidas em pontos da página de 1860 × 2631 do PDF fornecido.
// O texto é reduzido até caber na caixa, sem sobrescrever o rótulo impresso.
function fitText(font,text,maxWidth,preferredSize,minSize=11){
  let size=preferredSize;
  while(size>minSize&&font.widthOfTextAtSize(text,size)>maxWidth)size-=.5;
  if(font.widthOfTextAtSize(text,size)<=maxWidth)return {text,size};
  while(size>4.5&&font.widthOfTextAtSize(text,size)>maxWidth)size-=.25;
  return {text,size};
}
function writeBox(page,font,value,x,top,width,height=33,base=21){
  const text=String(value||'').trim().replace(/\s+/g,' '); if(!text)return;
  const horizontalPadding=8,verticalPadding=4;
  const fitted=fitText(font,text,width-horizontalPadding*2,Math.min(base,height-verticalPadding*2),11);
  const baseline=2631-top-height/2-fitted.size*.36;
  page.drawText(fitted.text,{x:x+horizontalPadding,y:baseline,size:fitted.size,font,color:PDFLib.rgb(.08,.11,.16)});
}
function wrapText(font,text,size,maxWidth){
  const lines=[];let remaining=text.trim();
  while(remaining){
    let cut=remaining.length;
    while(cut>1&&font.widthOfTextAtSize(remaining.slice(0,cut),size)>maxWidth)cut--;
    if(cut<remaining.length){const space=remaining.lastIndexOf(' ',cut);if(space>0)cut=space;}
    lines.push(remaining.slice(0,cut).trim());remaining=remaining.slice(cut).trim();
  }
  return lines;
}
function writeDateBox(page,font,iso,x,top,width,slashX1,slashX2,height=32){
  if(!iso)return;const [year,month,day]=String(iso).split('-');if(!day||!month||!year)return;
  const slashWidth=10;
  const segments=[[day,x,slashX1-x],[month,slashX1+slashWidth,slashX2-slashX1-slashWidth],[year,slashX2+slashWidth,x+width-slashX2-slashWidth]];
  segments.forEach(([value,start,segmentWidth])=>{
    const fitted=fitText(font,value,segmentWidth-6,22,12);
    const textWidth=font.widthOfTextAtSize(fitted.text,fitted.size);
    page.drawText(fitted.text,{x:start+(segmentWidth-textWidth)/2,y:2631-top-height/2-fitted.size*.36,size:fitted.size,font,color:PDFLib.rgb(.08,.11,.16)});
  });
}
function mark(page,x,top){page.drawText('X',{x:x-8,y:2631-top-9,size:23,font:window.pdfFont,color:PDFLib.rgb(.55,.1,.14)});}

// Produz uma cópia do PDF original e grava os dados em suas áreas correspondentes.
async function buildPdf(data){
  const original=await fetch('assets/ficha-original.pdf').then(r=>{if(!r.ok)throw new Error('Não foi possível carregar o modelo do PDF.');return r.arrayBuffer()});
  const pdf=await PDFLib.PDFDocument.load(original);
  const page=pdf.getPage(0);const font=await pdf.embedFont(PDFLib.StandardFonts.Helvetica);window.pdfFont=await pdf.embedFont(PDFLib.StandardFonts.HelveticaBold);
  const fields=[
    ['nome',145,362,1190,38],['cpf',1430,362,348,38],['rg',135,421,375,32],['nascimento',648,421,245,32],['sexo',1056,421,48,32],['sangue',1308,421,48,32],['admissao',1555,421,224,32],
    ['telefone',280,477,628,36],['email',998,477,780,36],['endereco',185,528,1145,35],['cep',1417,528,360,35],['bairro',157,587,328,34],['cidade',585,587,327,34],['uf',994,587,63,34],['cargo',1158,587,277,34],['situacao',1567,587,210,34]
  ];
  for(const [key,x,y,w,h] of fields){
    if(key==='nascimento'){writeDateBox(page,font,data.get(key),x,y,w,727.49,787.53,h);continue;}
    if(key==='admissao'){writeDateBox(page,font,data.get(key),x,y,w,1635.66,1695.69,h);continue;}
    let value=data.get(key);
    if(key==='sexo')value=String(value||'').charAt(0).toUpperCase();
    writeBox(page,font,value,x,y,w,h,22);
  }
  const complaint=(data.get('queixa')||'').trim();
  if(complaint){let size=22,lines=wrapText(font,complaint,size,1460);while(lines.length>3&&size>10){size-=.5;lines=wrapText(font,complaint,size,1460);}lines.slice(0,3).forEach((line,i)=>writeBox(page,font,line,292,733+i*44,1480,34,size));}
  for(const q of [...medical,...habits]){
    const selected=data.get(q.id);const index=q.options?.indexOf(selected)??-1;
    if(index>=0)mark(page,q.x[index],q.y);
    if(q.detail)writeBox(page,font,data.get(`${q.id}_detail`),...q.detailBox,15);
    if(q.input)writeBox(page,font,data.get(q.id),...q.box,18);
  }
  return new Blob([await pdf.save()],{type:'application/pdf'});
}

let currentUrl=null;
const form=document.querySelector('#patient-form'),button=document.querySelector('#submit-button'),result=document.querySelector('#result');
form.addEventListener('submit',async e=>{
  e.preventDefault();if(!form.reportValidity())return;
  button.disabled=true;button.firstChild.textContent='Gerando PDF... ';
  try{
    const data=new FormData(form);const blob=await buildPdf(data);
    if(currentUrl)URL.revokeObjectURL(currentUrl);currentUrl=URL.createObjectURL(blob);
    const filename=`ficha-sindpol-${String(data.get('nome')).trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')||'paciente'}.pdf`;
    // No celular, o menu nativo pode anexar o PDF diretamente ao WhatsApp.
    // A API pública do WhatsApp não permite anexar arquivos automaticamente via link wa.me.
    if(navigator.canShare&&navigator.share){
      const file=new File([blob],filename,{type:'application/pdf'});
      if(navigator.canShare({files:[file]})){
        result.hidden=false;result.innerHTML=`<strong>PDF gerado com sucesso.</strong><p>Escolha WhatsApp na janela de compartilhamento e selecione o contato +55 91 98164-3641. Se o compartilhamento não abrir, baixe o arquivo abaixo.</p><div class="result-actions"><a href="${currentUrl}" download="${filename}">Baixar PDF</a><a class="secondary" href="https://wa.me/5591981643641" target="_blank" rel="noopener noreferrer">Abrir WhatsApp</a></div>`;
        result.scrollIntoView({behavior:'smooth',block:'center'});
        try{await navigator.share({files:[file],title:'Ficha de atendimento SINDPOL',text:'Ficha de atendimento preenchida para envio ao SINDPOL.'})}catch(err){if(err.name!=='AbortError')console.warn('Compartilhamento indisponível:',err)}
        return;
      }
    }
    result.hidden=false;result.innerHTML=`<strong>PDF gerado com sucesso.</strong><p>Baixe a ficha e anexe o PDF na conversa do WhatsApp: +55 91 98164-3641. A conversa não anexa arquivos automaticamente no navegador.</p><div class="result-actions"><a href="${currentUrl}" download="${filename}">1. Baixar PDF</a><a class="secondary" href="https://wa.me/5591981643641" target="_blank" rel="noopener noreferrer">2. Abrir WhatsApp ↗</a></div>`;
    result.scrollIntoView({behavior:'smooth',block:'center'});
  }catch(err){result.hidden=false;result.textContent=`Não foi possível gerar o PDF: ${err.message}. Atualize a página e tente novamente.`;console.error(err)}
  finally{button.disabled=false;button.firstChild.textContent='Enviar formulário '}
});
