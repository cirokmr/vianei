# Ilustração das araucárias (abertura da home)

Silhuetas reais traçadas de `public/fotos/caminhada.webp` (araucárias adultas contra o céu cinza).

    python3 scripts/ilustracoes/compose.py   # requer Pillow

`trace.py` recorta cada árvore, separa céu e copa por limiar de luminosidade e vetoriza o contorno
(marching squares + simplificação). `compose.py` posiciona as árvores, estende os troncos até o chão e grava
`scene.json`/`scene.svg` na pasta atual. Para atualizar o site, leve as camadas de `scene.json` para
`public/ilustracoes/araucarias.svg`, mantendo as classes `araucarias-line`/`araucarias-tree` e os atrasos de
animação usados hoje nesse arquivo.
