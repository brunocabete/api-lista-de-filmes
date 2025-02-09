# api-lista-de-filmes
## Algumas possíveis melhorias
- Fazer tipos e interfaces para as respostas (DTO?)
- Refatoração do arquivo index.ts (mover rotas para outros arquivos)
- Docker compose com outro tipo de banco, a serem escolhidos através de variáveis de ambiente?

## Pontos para estudar mais a fundo
- Modelo de importação de módulos em arquivo (import com require ou import from)
    - Estudar diferenças e qual a forma mais utilizada para padronizar
- Como fazer o processamento do insert do log em paralelo, ao invés de dar await
- Usar argumento de erro do middleware express
- Fluxo do middleware
    - roda na request? na response? nos dois? como escolher quando o processamento vai entrar em ação?
- "Array de funções" é mesmo uma boa solução para expandir um middleware?
    - Como tratam as closures e os escopos? 
    - Como fazer elas serem mais síncronas?