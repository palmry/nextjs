Ad Targeting

```javascript static
import { abgroupTargeting } from 'wildsky-components'
```

## Usage

### abgroupTargeting()

Formats and returns output from ```getAllExperimentVariants()``` as string. Takes an options object with a delimiter property as an argument.

```javascript static
abgroupTargeting({delimiter: '|'})
```

## Working examples

```js
import { setExperimentConfig, abgroupTargeting } from './index'

// test experiments
const experimentConfig = {
  firstExperiment: {
    enabled: true,
    variants: {
      control: {
        weight: 1,
        metaData: {
          text: 'CONTROL',
        },
      },
      test: {
        weight: 1,
        metaData: {
          text: 'test',
        },
      },
    },
  },
  secondExperiment: {
    enabled: true,
    variants: {
      control: {
        weight: 1,
        metaData: {
          text: 'CONTROL',
        },
      },
      test: {
        weight: 1,
        metaData: {
          text: 'test',
        },
      },
    },
  },
}

// setting the test experiment
setExperimentConfig(experimentConfig)

;<>
  <h2>abgroupTargeting</h2>
  <div>{abgroupTargeting()}</div>
</>
```
