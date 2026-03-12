# 💰 Finance Tracker — Backend

API GraphQL para un tracker de finanzas personales construido con NestJS, Prisma y Apollo Server. Permite gestionar cuentas de débito, crédito, efectivo y ahorros, registrar transacciones, definir presupuestos y metas de ahorro.

---

## 🛠 Tech Stack

| Tecnología | Versión | Rol |
|---|---|---|
| NestJS | ^10 | Framework principal |
| Prisma | ^5 | ORM y cliente de base de datos |
| PostgreSQL | ^16 | Base de datos relacional |
| Apollo Server | ^4 | Servidor GraphQL |
| GraphQL | ^16 | Lenguaje de consultas |
| JWT | — | Autenticación stateless |
| CQRS | — | Patrón de arquitectura |
| pnpm | ^9 | Package manager |

---

## 📦 Dependencias

### Core — NestJS

```bash
pnpm add @nestjs/common @nestjs/core @nestjs/platform-express
```

| Paquete | Descripción |
|---|---|
| `@nestjs/common` | Decoradores, guards, interceptors, pipes y utilidades base de NestJS |
| `@nestjs/core` | Motor interno del framework — inyección de dependencias, módulos, ciclo de vida |
| `@nestjs/platform-express` | Adaptador HTTP que conecta NestJS con Express por debajo |

---

### Base de datos — Prisma

```bash
pnpm add prisma @prisma/client
npx prisma init
```

| Paquete | Descripción |
|---|---|
| `prisma` | CLI de Prisma — genera el cliente, corre migraciones y abre Prisma Studio |
| `@prisma/client` | Cliente autogenerado para interactuar con la base de datos con tipado completo |

**Comandos útiles:**

```bash
npx prisma migrate dev --name init   # crea y aplica una migración
npx prisma generate                  # regenera el cliente tras cambios al schema
npx prisma studio                    # abre UI visual de la base de datos en localhost:5555
```

---

### GraphQL — Apollo Server

```bash
pnpm add @nestjs/graphql @nestjs/apollo @apollo/server graphql
```

| Paquete | Descripción |
|---|---|
| `@nestjs/graphql` | Integración de GraphQL con NestJS — decoradores `@Resolver`, `@Query`, `@Mutation`, `@ObjectType`, etc. |
| `@nestjs/apollo` | Driver que conecta NestJS GraphQL con Apollo Server 4 |
| `@apollo/server` | Servidor GraphQL Apollo v4 — maneja el playground, parsing de queries y ejecución |
| `graphql` | Librería core de GraphQL — requerida como peer dependency por todos los paquetes anteriores |

**Configuración en `app.module.ts`:**

```ts
GraphQLModule.forRoot<ApolloDriverConfig>({
  driver: ApolloDriver,
  autoSchemaFile: join(process.cwd(), 'src/schema.gql'), // genera el schema automáticamente
  context: ({ req }) => ({ req }),                        // necesario para leer el JWT en los guards
})
```

---

### Autenticación — JWT + Passport

```bash
pnpm add @nestjs/jwt @nestjs/passport passport passport-jwt
pnpm add -D @types/passport-jwt
```

| Paquete | Descripción |
|---|---|
| `@nestjs/jwt` | Módulo de NestJS para firmar y verificar tokens JWT |
| `@nestjs/passport` | Integración de Passport con el sistema de guards de NestJS |
| `passport` | Middleware de autenticación de Node.js — base del sistema de estrategias |
| `passport-jwt` | Estrategia de Passport para autenticar requests via Bearer Token en el header |
| `@types/passport-jwt` | Tipos de TypeScript para `passport-jwt` |

**Flujo de autenticación:**

```
POST /graphql (login) → genera JWT → cliente guarda el token
→ requests siguientes incluyen Authorization: Bearer <token>
→ JwtAuthGuard verifica el token → @CurrentUser() inyecta el usuario en el resolver
```

---

### Seguridad y validación

```bash
pnpm add bcrypt class-validator class-transformer
pnpm add -D @types/bcrypt
```

| Paquete | Descripción |
|---|---|
| `bcrypt` | Hashea contraseñas con salt — nunca se guarda la contraseña en texto plano |
| `@types/bcrypt` | Tipos de TypeScript para `bcrypt` |
| `class-validator` | Valida los DTOs con decoradores (`@IsEmail`, `@IsString`, `@Min`, etc.) |
| `class-transformer` | Transforma objetos planos a instancias de clases — necesario para que `class-validator` funcione con NestJS |

**Habilitarlo globalmente en `main.ts`:**

```ts
app.useGlobalPipes(new ValidationPipe({
  whitelist: true,       // elimina campos no declarados en el DTO
  forbidNonWhitelisted: true, // lanza error si llegan campos extra
  transform: true,       // transforma automáticamente los tipos
}));
```

---

### Arquitectura — CQRS

```bash
pnpm add @nestjs/cqrs
```

| Paquete | Descripción |
|---|---|
| `@nestjs/cqrs` | Implementación del patrón Command Query Responsibility Segregation para NestJS |

**Por qué CQRS en este proyecto:**

Separa las operaciones de escritura (Commands) de las de lectura (Queries), haciendo cada operación responsabilidad de un solo archivo. En lugar de un service monolítico, cada acción tiene su propio handler aislado y testeable.

```
Resolver → CommandBus → CreateTransactionHandler  (escritura)
Resolver → QueryBus   → GetTransactionsHandler    (lectura)
```

**Piezas del patrón:**

| Clase | Rol |
|---|---|
| `Command` | DTO de intención — lleva los datos de lo que se quiere hacer |
| `CommandHandler` | Ejecuta la lógica de negocio de ese command |
| `Query` | DTO de consulta — lleva los filtros y parámetros de lectura |
| `QueryHandler` | Ejecuta la consulta y retorna los datos |
| `CommandBus` | Enruta el command al handler correcto |
| `QueryBus` | Enruta la query al handler correcto |

---

### Variables de entorno

```bash
pnpm add @nestjs/config
```

| Paquete | Descripción |
|---|---|
| `@nestjs/config` | Carga y valida variables de entorno desde `.env` — wrapper sobre `dotenv` integrado con el sistema de módulos de NestJS |

---

## 🗂 Estructura del proyecto

```
src/
├── app.module.ts
├── prisma/                    # módulo global de base de datos
├── auth/                      # registro, login, JWT
├── accounts/                  # débito, crédito, efectivo, ahorros
├── transactions/              # gastos e ingresos con actualización de saldos
├── categories/                # categorías de gastos
├── budgets/                   # presupuesto mensual por categoría
├── savings-goals/             # metas de ahorro
└── reports/                   # reportes y gráficas (solo queries)
```

Cada módulo sigue la misma estructura:

```
module/
├── commands/
│   └── create-x/
│       ├── create-x.command.ts    # DTO de intención (solo datos)
│       └── create-x.handler.ts   # lógica de negocio
├── queries/
│   └── get-x/
│       ├── get-x.query.ts
│       └── get-x.handler.ts
├── models/                        # ObjectTypes de GraphQL
├── dto/                           # InputTypes de GraphQL
├── x.resolver.ts                  # expone queries y mutations
└── x.module.ts
```

---

## ⚙️ Variables de entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
DATABASE_URL="postgresql://finance:finance123@localhost:5432/financedb"
JWT_SECRET="reemplaza-con-un-secret-largo-y-seguro"
JWT_EXPIRES_IN="7d"
```

---

## 🚀 Instalación y arranque

```bash
# Instalar dependencias
pnpm install

# Correr migraciones
npx prisma migrate dev --name init

# Iniciar en desarrollo
pnpm run start:dev

# Abrir GraphQL Playground
# http://localhost:3000/graphql
```

---

## 🗄 Base de datos con Docker

```bash
docker run --name finance-db \
  -e POSTGRES_USER=finance \
  -e POSTGRES_PASSWORD=finance123 \
  -e POSTGRES_DB=financedb \
  -p 5432:5432 \
  -d postgres:16
```

---

## 📋 Módulos y responsabilidades

| Módulo | Responsabilidad |
|---|---|
| `auth` | Registro, login, generación y validación de JWT |
| `accounts` | CRUD de cuentas — débito, crédito, efectivo, ahorros |
| `transactions` | Registro de gastos e ingresos con actualización automática de saldos |
| `categories` | Categorías personalizables con presupuesto opcional por categoría |
| `budgets` | Presupuesto mensual por categoría con seguimiento de gasto actual |
| `savings-goals` | Metas de ahorro con progreso y cuenta vinculada |
| `reports` | Queries de agregación — reporte mensual, flujo de caja, gastos por categoría |
