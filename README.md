# oj-core-script

Example of node.js - postgresql - graphql backend web-app.
Which uses @reflex

# usage
First set up config/local.json configuration file.
Then run the script to pull DB schema to generate entities for ORM

```bash
yarn schema

```
When update Graphql schema do not forget to gen types form it

```bash
yarn codegen

```

