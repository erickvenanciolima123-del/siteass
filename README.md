# Abravanel Shop — edição 3D

Redesign do projeto enviado, mantendo React, TypeScript, Vite, catálogo, Firebase e servidor Express. A interface está em português e foi revisada em desktop e celular.

## Abrir e editar

Use Node.js 24 (versão usada na validação). Na pasta do projeto:

```bash
npm install
npm run dev
```

Abra **http://localhost:3000**. O código está em `src/` e as imagens em `public/assets/`.

Para conferir o código e gerar a versão final:

```bash
npm run lint
npm run build
npm run preview
```

O preview informa o endereço no terminal. `npm start` serve a pasta `dist/` pelo Express na porta 3000, após o build.

## Versão compilada e prévias

A pasta **dist/** já está compilada. Ela pode ser enviada a uma hospedagem estática. Para abrir localmente, use um servidor HTTP; não abra `dist/index.html` por duplo clique.

As capturas em **previas/** mostram a página completa e a primeira tela em desktop e celular.

## O que mudou

- Identidade escura com verde menta, tipografia local, novo logotipo e hierarquia visual.
- Hero com arte exclusiva, três atalhos visuais de categorias e duas coleções ilustradas.
- Ícones desenhados em SVG com profundidade, brilho e perspectiva em CSS.
- Quatro objetos reais em Three.js: Steam coin, controle, bloco voxel e chave. Incluem arraste, navegação por teclado, pausa, reset e alternativa visual quando WebGL não estiver disponível.
- Carregamento da área 3D próximo da rolagem, resolução limitada, pausa de renderização fora da tela e descarte de recursos ao desmontar.
- Catálogo com capas locais, busca sem distinção de acentos, ordenação, disponibilidade, favoritos persistentes e carregamento de mais itens.
- Carrinho persistente, quantidades limitadas ao estoque e atualização de produtos antigos do carrinho pelo catálogo atual.
- Novas seções de assinaturas, como funciona, perguntas frequentes e comunidade.
- Menu mobile, foco visível, Escape nos diálogos, retenção de foco, retorno ao botão de origem e suporte à preferência de movimento reduzido.
- Ajustes nos nomes Red Dead Redemption e Mortal Kombat. Preços, produtos e disponibilidade vêm do catálogo original.

## Checkout e serviços

**O checkout é uma demonstração.** O projeto original simulava pagamentos e gerava credenciais fictícias. Esta versão identifica o teste explicitamente, não coleta cartão, não emite Pix ou chaves e não envia pedidos de teste ao servidor ou ao Firebase. Os pedidos de teste ficam no navegador com `isDemo: true` e status pendente.

Pagamentos reais, confirmação por webhook, estoque de licenças e entrega real precisam de uma integração de servidor antes de vender. Os endpoints Express originais continuam sendo exemplos com armazenamento em memória; não são um sistema de pagamentos ou de pedidos de produção.

A configuração Firebase original foi preservada em `firebase-applet-config.json`. A autenticação Google e a conexão ao Firestore não foram validadas com credenciais reais neste ambiente. Para uso no seu domínio, confirme a configuração, os domínios autorizados e as regras do projeto.

Os dados e avaliações iniciais foram preservados do projeto enviado. Revise esses conteúdos, as políticas e o catálogo antes de publicar comercialmente.

## Personalizar

- Produtos, preços e estoque: `src/data/products.ts`.
- Cores, espaçamentos e responsividade: `src/index.css`.
- Objetos 3D: `src/components/GamingPlayground.tsx`.
- Ícones e marca: `src/components/BrandIcon.tsx`.
- Imagens e capas: `public/assets/`.
- Canais de atendimento: copie `.env.example` para `.env.local`, preencha os links e gere o build novamente. O convite padrão do Discord veio do texto do projeto original; confirme se ele é válido. WhatsApp e Instagram só aparecem se configurados com URL HTTPS.

## Artes e origem

Três artes foram solicitadas ao **Nano Banana Pro pelo Higgsfield**: hero com controle, coleção de aventura e coleção de corrida. O serviço retornou os jobs identificados como **Nano Banana 2**, apesar do parâmetro solicitado `nano_banana_pro`. A diferença e os prompts estão registrados em `docs/image-generation.md`.

As artes foram otimizadas para WebP. As capas vêm do CDN da Steam, com os endereços registrados em `docs/cover-sources.json`; as marcas e imagens dos jogos pertencem aos respectivos titulares. Os ícones e as geometrias 3D foram criados diretamente no código. As imagens conceituais das coleções não representam capturas dos jogos.

## Validação

`npm run lint` e `npm run build` concluídos. Foram verificados 33 comportamentos de interface, incluindo os quatro objetos WebGL, busca, filtros, favoritos, carrinho, checkout demonstrativo, pedidos, menu mobile, FAQ e movimento reduzido. O relatório está em `docs/verification.json`.

A versão compilada foi conferida também em 1440, 390 e 320 pixels de largura, sem rolagem horizontal. Não houve erros JavaScript de interface. A conexão externa ao Firebase permaneceu fora da validação. O build informa chunks grandes para Firebase e Three.js; a área Three.js é carregada separadamente.
