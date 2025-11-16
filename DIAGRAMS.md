# Swaglex Architecture Diagrams

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                      Swaglex Framework                       │
└─────────────────────────────────────────────────────────────┘

┌─────────────┐    ┌──────────────┐    ┌─────────────┐
│   loader.js │───▶│  server.js   │◀───│middleware.js│
└─────────────┘    └──────────────┘    └─────────────┘
       │                   │                    │
       │                   │                    │
       ▼                   ▼                    ▼
  Load Spec          Create Server      Create Endpoints
  Resolve $refs      Configure          Handle Requests
  Parse YAML/JSON    Setup Routes       Error Handling
```

## Module Dependencies

```
┌─────────────────────────────────────────────────┐
│                   index.js                      │
│  (Main Entry Point - Exports Everything)        │
└─────────────────────────────────────────────────┘
               │
               ├──────────┬────────────┬──────────┐
               ▼          ▼            ▼          ▼
         ┌─────────┐ ┌─────────┐ ┌──────────┐ ┌────────┐
         │ loader  │ │ server  │ │middleware│ │ types/ │
         │  .js    │ │  .js    │ │   .js    │ │index.d │
         └─────────┘ └─────────┘ └──────────┘ └────────┘
```

## Data Flow

```
User Request Flow:
═══════════════

1. User visits http://localhost:3001/api-docs

   HTTP Request
        │
        ▼
   ┌─────────┐
   │ Express │
   │  App    │
   └─────────┘
        │
        ├──▶ CORS Middleware
        ├──▶ JSON Parser
        │
        ▼
   Route Matching
        │
        ├──▶ /api-docs      → Swagger UI
        ├──▶ /api-docs.json → JSON Spec
        ├──▶ /api-docs.yaml → YAML Spec
        ├──▶ /health        → Health Check
        ├──▶ /validate      → Validation
        └──▶ /              → Redirect to UI
        │
        ▼
   Response
```

## Component Architecture

```
┌──────────────────────────────────────────────────┐
│              createSwaggerServer()                │
│  (Main Factory Function)                          │
└──────────────────────────────────────────────────┘
                    │
                    ├─── Loads Configuration
                    │         │
                    │         ▼
                    │    ┌─────────────┐
                    │    │Config Merge │
                    │    │with Defaults│
                    │    └─────────────┘
                    │
                    ├─── Creates Express App
                    │         │
                    │         ▼
                    │    ┌─────────────┐
                    │    │ Express()   │
                    │    └─────────────┘
                    │
                    ├─── Loads Specification
                    │         │
                    │         ▼
                    │    ┌──────────────────┐
                    │    │loadSwaggerSpec() │
                    │    │ - Parse YAML     │
                    │    │ - Resolve $refs  │
                    │    └──────────────────┘
                    │
                    ├─── Registers Middleware
                    │         │
                    │         ▼
                    │    ┌──────────────────┐
                    │    │ CORS             │
                    │    │ JSON Parser      │
                    │    │ Custom Routes    │
                    │    └──────────────────┘
                    │
                    ├─── Registers Endpoints
                    │         │
                    │         ▼
                    │    ┌──────────────────┐
                    │    │ JSON Endpoint    │
                    │    │ YAML Endpoint    │
                    │    │ Health Check     │
                    │    │ Validation       │
                    │    │ Swagger UI       │
                    │    └──────────────────┘
                    │
                    └─── Returns Server Object
                              │
                              ▼
                         ┌──────────┐
                         │{ app,    │
                         │  spec,   │
                         │  config, │
                         │  start() }│
                         └──────────┘
```

## $ref Resolution Process

```
┌────────────────────────────────────────────────┐
│          OpenAPI Spec with $refs               │
│                                                │
│  paths:                                        │
│    /users:                                     │
│      $ref: './paths/users.yaml'               │
│  components:                                   │
│    schemas:                                    │
│      $ref: './components/schemas.yaml'        │
└────────────────────────────────────────────────┘
                    │
                    ▼
         ┌──────────────────┐
         │ loadSwaggerSpec()│
         └──────────────────┘
                    │
                    ▼
         ┌──────────────────┐
         │  resolveRefs()   │
         │  Recursive Walk  │
         └──────────────────┘
                    │
     ┌──────────────┼──────────────┐
     │              │              │
     ▼              ▼              ▼
Found $ref?    Array?        Object?
     │              │              │
     ▼              ▼              ▼
Parse File    Map Items    Walk Keys
Load Content  Resolve Each Resolve Each
     │              │              │
     └──────────────┴──────────────┘
                    │
                    ▼
         ┌──────────────────┐
         │ Fully Resolved   │
         │ OpenAPI Spec     │
         └──────────────────┘
```

## Request/Response Flow

```
Client Request:
───────────────

GET /api-docs.json
      │
      ▼
┌─────────────┐
│   Express   │
│   Router    │
└─────────────┘
      │
      ▼
┌─────────────┐
│createJson   │
│Endpoint()   │
└─────────────┘
      │
      ▼
┌─────────────┐
│res.setHeader│
│res.send()   │
└─────────────┘
      │
      ▼
Client receives JSON spec


POST /validate
      │
      ▼
┌─────────────┐
│   Express   │
│   Router    │
└─────────────┘
      │
      ▼
┌─────────────┐
│createValid  │
│ationEndpoint│
└─────────────┘
      │
      ▼
┌─────────────┐
│Validate Spec│
│Count Paths  │
│Return Result│
└─────────────┘
      │
      ▼
Client receives validation result
```

## Configuration Flow

```
User Config + Default Config
         │
         ▼
    ┌─────────┐
    │ Merge   │
    │ Spread  │
    │Operator │
    └─────────┘
         │
         ▼
   Final Config
         │
         ├──▶ Server Settings (port, cors)
         ├──▶ Feature Flags (health, validation)
         ├──▶ Paths (uiPath, jsonPath, etc.)
         ├──▶ UI Options (css, swagger options)
         └──▶ Custom (routes, fallback)
```

## Usage Patterns Comparison

```
Pattern 1: Complete Server (Simplest)
═════════════════════════════════════
┌──────────────────┐
│User Code (3 lines│
└──────────────────┘
         │
         ▼
createSwaggerServer()
         │
         ▼
┌──────────────────┐
│ Complete Server  │
│ All Features     │
└──────────────────┘


Pattern 2: Individual Components
═════════════════════════════════
┌──────────────────┐
│User Code (custom)│
└──────────────────┘
         │
         ├──▶ loadSwaggerSpec()
         ├──▶ createJsonEndpoint()
         ├──▶ createHealthCheck()
         └──▶ etc...
         │
         ▼
┌──────────────────┐
│ Custom Server    │
│ Pick & Choose    │
└──────────────────┘


Pattern 3: Extended Server
══════════════════════════
┌──────────────────┐
│User Code         │
└──────────────────┘
         │
         ▼
createSwaggerServer()
         │
         ▼
server.app.use(custom)
         │
         ▼
┌──────────────────┐
│ Extended Server  │
│ Base + Custom    │
└──────────────────┘
```

## Middleware Stack

```
Request
   │
   ▼
┌─────────────┐
│   CORS      │ ◀── Optional (config.cors)
└─────────────┘
   │
   ▼
┌─────────────┐
│ JSON Parser │
└─────────────┘
   │
   ▼
┌─────────────┐
│Route: /json │ ◀── createJsonEndpoint()
└─────────────┘
   │
   ▼
┌─────────────┐
│Route: /yaml │ ◀── createYamlEndpoint()
└─────────────┘
   │
   ▼
┌─────────────┐
│Route:/health│ ◀── createHealthCheck()
└─────────────┘
   │
   ▼
┌─────────────┐
│Route: /docs │ ◀── Swagger UI
└─────────────┘
   │
   ▼
┌─────────────┐
│Custom Routes│ ◀── config.routes()
└─────────────┘
   │
   ▼
┌─────────────┐
│Error Handler│ ◀── createErrorHandler()
└─────────────┘
   │
   ▼
┌─────────────┐
│404 Handler  │ ◀── create404Handler()
└─────────────┘
   │
   ▼
Response
```

## File Structure & Responsibilities

```
swaglex/
│
├── src/
│   │
│   ├── index.js          ┌─────────────────────┐
│   │                     │ Exports everything  │
│   │                     │ Main entry point    │
│   │                     └─────────────────────┘
│   │
│   ├── loader.js         ┌─────────────────────┐
│   │                     │ Load OpenAPI specs  │
│   │                     │ Resolve $refs       │
│   │                     │ Parse YAML/JSON     │
│   │                     └─────────────────────┘
│   │
│   ├── middleware.js     ┌─────────────────────┐
│   │                     │ JSON endpoint       │
│   │                     │ YAML endpoint       │
│   │                     │ Health check        │
│   │                     │ Validation          │
│   │                     │ Error handlers      │
│   │                     └─────────────────────┘
│   │
│   └── server.js         ┌─────────────────────┐
│                         │ Create server       │
│                         │ Merge config        │
│                         │ Setup middleware    │
│                         │ Register routes     │
│                         │ Start function      │
│                         └─────────────────────┘
│
├── types/
│   └── index.d.ts        ┌─────────────────────┐
│                         │ TypeScript types    │
│                         │ Interface definitions│
│                         │ Function signatures │
│                         └─────────────────────┘
│
└── examples/             ┌─────────────────────┐
    ├── basic.js          │ Minimal usage       │
    ├── advanced.js       │ Full configuration  │
    └── custom.js         │ Individual parts    │
                          └─────────────────────┘
```

## Lifecycle

```
Server Lifecycle:
═════════════════

┌─────────────────┐
│ Import Swaglex  │
└─────────────────┘
        │
        ▼
┌─────────────────┐
│ Create Config   │
└─────────────────┘
        │
        ▼
┌─────────────────┐
│ Call create     │
│ SwaggerServer() │
└─────────────────┘
        │
        ├─── Load Spec
        ├─── Create Express App
        ├─── Setup Middleware
        ├─── Register Routes
        │
        ▼
┌─────────────────┐
│ Returns Server  │
│ Object          │
└─────────────────┘
        │
        ▼
┌─────────────────┐
│ Call start()    │
└─────────────────┘
        │
        ▼
┌─────────────────┐
│ Server Running  │
└─────────────────┘
        │
        ▼
┌─────────────────┐
│ Handle Requests │
│ Serve Docs      │
└─────────────────┘
        │
        ▼
┌─────────────────┐
│ Graceful        │
│ Shutdown        │
└─────────────────┘
```

## Legend

```
┌─────┐
│ Box │  = Component/Process
└─────┘

───▶    = Flow direction
  │
  ▼     = Downward flow

◀──     = Input/Option

═══     = Important section
```
