# Konceitto Interiores · LP de apresentação

Landing page de apresentação de layout para a Konceitto Interiores (marcenaria de alto padrão, Brasília · @konceittointeriores).
Layout baseado na referência "luzen": hero com foto cheia e números, seções numeradas 01–05, projetos em fundo escuro, FAQ, CTA duplo com vidro fosco e rodapé com a marca gigante.

HTML/CSS/JS estático + GSAP/ScrollTrigger + Lenis (CDN). Preview local: `launch.json` → "konceitto" (porta 5190).

## Funções
- Botão de WhatsApp (topo, flutuante, cards e CTAs) abre o formulário qualificador em 6 etapas:
  ambientes · fase do imóvel · já tem projeto · prazo · investimento · nome/WhatsApp/bairro + LGPD.
  No fim abre `wa.me/5561998491035` com o resumo pronto.
- Clicar num ambiente da galeria horizontal abre o formulário com aquele ambiente já marcado.
- Animações: abertura com o ícone sendo desenhado, títulos palavra a palavra, imagens com cortina + zoom,
  parallax, contadores, galeria horizontal fixada (desktop), marquee, cursor "Ver", botão magnético, FAQ suave.

## Configurar (topo de `assets/js/main.js`)
- `KONCEITTO_WHATSAPP`: 5561998491035 (número visto em post do Instagram; confirmar com a cliente)
- `KONCEITTO_LEAD_ENDPOINT`: vazio = só registra no console. Pode apontar para CRM/planilha.
- `privacidade.html`: trocar `[e-mail de contato]`.

## Imagens
- Fotos reais do Instagram da Konceitto (`p-*.webp`, `karina*.webp`, `equipe-fabrica.webp`). Marca d'água recortada em algumas.
- Hero, faixa larga da seção 02 e fundo do CTA (`hero.webp`, `wide-cozinha.webp`, `cta-bg.webp`) são do Unsplash (licença livre),
  porque as fotos do Instagram são verticais de celular. Ideal substituir por fotos profissionais dos projetos da Konceitto.
- Logo recriado em vetor a partir do post "Nova marca": pedir o arquivo oficial.

## Texto inferido (confirmar com a cliente)
- "360° do projeto à montagem", "1 só equipe", "projeto 3D", montagem com equipe própria, pós-venda.
- Etapas do processo, respostas do FAQ, atendimento "Brasília e DF".
- Nomes/legendas dos projetos; "Recepção com muxarabi · com Farolim Arquitetura" (post compartilhado pela Farolim).
- Faixas de investimento do formulário.

## Seções extras (2ª versão)
- **Imagem que se expande** (depois do "Sobre"): ao rolar, a foto do closet abre de um quadro pequeno para a tela cheia, e as palavras "O alto padrão / nos detalhes" saem pelas laterais.
- **Simulador de estilos** (`#estilos`): sala vazia + 4 estilos de marcenaria (Contemporâneo amadeirado, Minimalista, Urbano grafite, Clássico atemporal).
  Ao escolher, a sala "ganha" os móveis com uma cortina e uma linha de luz. Tem comparação antes/depois arrastável e o botão
  "Quero minha sala assim" abre o formulário com o estilo escolhido (vai na mensagem do WhatsApp).
  Na primeira vez que a seção aparece, a sala muda sozinha para o estilo contemporâneo.
- **Detalhes** (fundo escuro): imagem fixa que troca conforme o texto rola (lâminas, cavas/puxadores, ferragens, iluminação).
- **Faixa de imagem cheia** antes do CTA: "Fabricação própria. Montagem própria."
- Código em `assets/css/sections.css` e `assets/js/sections.js`.

### Imagens das seções extras
- `estilo-*.webp`: geradas por IA (Higgsfield, gpt_image_2_6) a partir da mesma sala vazia. Marcadas na página como "Simulação ilustrativa".
  Ideal trocar por renders 3D reais da Konceitto, com a mesma câmera em todos os estilos.
- `big-closet.webp`, `big-sala-painel.webp`, `det-*.webp`: Unsplash (licença livre).
