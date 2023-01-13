AB Test system.

```javascript static
import { useExperiment, setExperimentConfig, getAllExperimentVariants } from 'wildsky-components'
```

## Usage

### setExperimentConfig()

Sets the experiment config data and initializes the AB test system. This must be called before any other calls are made.

Normally this data will be imported from JSON that's downloaded from contentful.

```javascript static
setExperimentConfig(experiments)
```

### useExperiment()

Allows you access the variant data of the experiment that the user is in.

```javascript static
// call useExperiment for the experiment you want to use
const Experiment = useExperiment('HelloWorldExperiment')
```

You can check if a specific variant is active by checking if the variant key on the experiment is truthy:

```javascript static
if(Experiment.helloUniverse){...}
```

Or in react:

```jsx static
{
  Experiment.helloUniverse && <h1>HELLO UNIVERSE!</h1>
}
```

You can use the experiment as a component to optionally render components depending on the variant.

This example will only display 'Hello World!' if the user is in the 'helloWorld' variant:

```jsx static
<Experiment variant="helloWorld">
  <h1>Hello World!</h1>
</Experiment>
```

You can also access the variant's metaData:

```jsx static
<Experiment variant="control">
  <h1>Control!</h1>
  <h2>{Experiment.metaData.text}</h2>
</Experiment>
```

### getAllExperimentVariants()

returns every active experiment and which variant the user should see.

## Debugging

### Overriding Test Variants

You can override the random variant bucketing and specify a specific variant (useful for development) by passing a URL parameter of `abtest`.
The value should go in the form of `experiment:variant`. You can specify values for multiple experiments by separating them with a pipe `|`

```js static
?abtest=HelloWorldExperiment:helloWorld|Myexperiment:myVariant
```

### Dumping experiment data

You can see the state of the ab test system by running the `debugABTests()` function in the browser developer console.

## Working example

(View Source)

```jsx
import { useExperiment, setExperimentConfig, getAllExperimentVariants } from '../index'

// Normally you will import the JSON for this
const experimentConfig = {
  HelloWorldExperiment: {
    enabled: true,
    variants: {
      control: {
        weight: 1,
        metaData: {
          text: 'CONTROL',
        },
      },
      helloWorld: {
        weight: 1,
        metaData: {
          text: 'Hello World!',
        },
      },
      helloUniverse: {
        weight: 1,
        metaData: {
          text: 'Hello Universe!',
        },
      },
    },
  },
}

// You must set the experiment config before calls to useExperiment
setExperimentConfig(experimentConfig)

const [rerollCount, setRerollCount] = React.useState(0)

// call useExperiment for the experiment you want to use
const Experiment = useExperiment('HelloWorldExperiment')

const reroll = () => {
  window.sessionStorage.clear()
  setExperimentConfig(experimentConfig)
  setRerollCount(rerollCount + 1)
}

;<>
  {/* Check for variant with Boolean syntax*/}
  {Experiment.helloUniverse && <h1>HELLO UNIVERSE!</h1>}

  {/* Component syntax for variants*/}
  <Experiment variant="helloWorld">
    <h1>Hello World!</h1>
  </Experiment>

  {/* You can also access the metada attached to a variant*/}
  <Experiment variant="control">
    <h1>Control!</h1>
    <h2>{Experiment.metaData.text}</h2>
  </Experiment>

  {/* the getAllExperimentVariants() function will return all selected variants for every experiment */}
  <p>
    All variants: <code>{JSON.stringify(getAllExperimentVariants(), null, 2)}</code>
  </p>
  <button onClick={reroll}>Reroll Variants</button>
</>
```
