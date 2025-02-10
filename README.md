# api-lista-de-filmes

## Utilização
1- `docker build -t api-filmes .`

2- `docker run -d -p 3000:3000 -e MOVIEDB_API_TOKEN=<seu token> api-filmes`

3- Acessar http://localhost:3000/docs/

4- Fazer 'login' (só fazer a requisição exemplo)

5- Usar os outros endpoints


## Tecnologias
- Express
- Axios
- Prisma ORM
- Docker
- Typescript

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
- Padrão Swagger 2.0 ou OpenAPI 3.0?
- Testes unitários e de integração