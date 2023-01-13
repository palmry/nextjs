Repository for global configuration data.

Often we run into issues where we have global, static configuration data that needs to
be accessible by different components, including components in WSC. This package facilitates the registration
and access to such global configuration data.

## Config Types

globalConfig has defined config types. Config types define and store related config data.
An example of a config type is `AdConfig` for ad-related configuration data.

### Config type shapes

Each config type has a `shape`. The `shape` defines the shape, or valid keys and value types for a specific config type.
Shapes are defined and validated using the `PropTypes` library, so it should be familiar.

### Config type defaults

Each config type also has a `defaultObj` that specifies any default keys and values for the type.

## Setting config data

The `setConfig` function can be used to set config data for a specific config type.

```js static
setConfig(configType, configObject)
```

- **configType** The config type you are setting
- **configObject** An object containing the keys and values you want to set. `configObject` is merged over the default, or previously set config.

## Getting config data

the `getConfig` function can be used to retrieve an object containing all the config data for a specific config type.

```js static
getConfig(configType)
```

- **configType** The config type you wish to read
- **return value** Object containing the data for the config type
