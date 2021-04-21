# react-d3-calendar-heatmap

Calendar HeatMap built with [D3](https://github.com/d3)
and [React](https://facebook.github.io/react) based on [Mike Bostock´s Calendar View](https://observablehq.com/@d3/calendar-view).

[![npm version](https://badge.fury.io/js/react-d3-calendar-heatmap.svg)](https://badge.fury.io/js/react-d3-calendar-heatmap)
[![Code Climate](https://codeclimate.com/github/jquintozamora/react-d3-calendar-heatmap/badges/gpa.svg)](https://codeclimate.com/github/jquintozamora/react-d3-calendar-heatmap)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](Readme.md#want-to-contribute)

## DEMO

[React D3 Calendar Heatmap demo](https://jquintozamora.github.io/react-d3-calendar-heatmap)
## Installation

Steps to use react-d3-calendar-heatmap in your React project

### 1.Install from NPM

```
npm install --save react-d3-calendar-heatmap
```

### 2. Import and use in your application

```js
import CalendarHeatMap from "react-d3-calendar-heatmap";
```

### 3. Usage

```ts
interface CalendarHeatMapItemType {
  day: string
  value: number
  projects?: Array<Record<string, number>>
}

<CalendarHeatMap<CalendarHeatMapItemType> data={data} />
```

## App sample

You can see an example of App [here](https://github.com/jquintozamora/react-d3-calendar-heatmap/blob/main/demo/App/App.tsx).

## Data sample

You can see an example of data [here](https://github.com/jquintozamora/react-d3-calendar-heatmap/blob/main/demo/data/data.ts).

## License

BSD 3-Clause License

Copyright (c) 2021, [José Quinto](https://blog.josequinto.com)
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

- Redistributions of source code must retain the above copyright notice, this
  list of conditions and the following disclaimer.

- Redistributions in binary form must reproduce the above copyright notice,
  this list of conditions and the following disclaimer in the documentation
  and/or other materials provided with the distribution.

- Neither the name of the copyright holder nor the names of its
  contributors may be used to endorse or promote products derived from
  this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
