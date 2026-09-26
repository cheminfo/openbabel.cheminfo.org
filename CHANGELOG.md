# Changelog

## [1.3.0](https://github.com/cheminfo/openbabel.cheminfo.org/compare/v1.2.0...v1.3.0) (2026-09-26)


### Features

* add web frontend with 2D/3D/SVG structure preview ([23c9057](https://github.com/cheminfo/openbabel.cheminfo.org/commit/23c9057d8d79a0cb7fcf816d16703367fe652442))
* align project with current standards ([1165f5a](https://github.com/cheminfo/openbabel.cheminfo.org/commit/1165f5a237b95550e4dfc7388f81114f848e44cd))
* copy values with a click and keep the tool text unselectable ([5d8633e](https://github.com/cheminfo/openbabel.cheminfo.org/commit/5d8633e8e706a61366b9d83a986befe841f045cf))
* draw structures with react-cheminfo's StructureEditor ([c0d6142](https://github.com/cheminfo/openbabel.cheminfo.org/commit/c0d6142089a8521db347831aaae6f4c2ab3bec86))
* limit parallel conversions and kill long-running ones ([133b567](https://github.com/cheminfo/openbabel.cheminfo.org/commit/133b567ab32f7a95f325f4e43c3956c2023623c7))
* split into a TypeScript backend and a react-cheminfo frontend ([491f092](https://github.com/cheminfo/openbabel.cheminfo.org/commit/491f092d1d5e002c15374a465e7d3a56271f0561))


### Bug Fixes

* **compose:** drop ulimits.nproc/nofile, use pids_limit instead ([5f29817](https://github.com/cheminfo/openbabel.cheminfo.org/commit/5f29817cd2e4cc14c4905b2b34dbc85a28c6784e))
* **compose:** traefik default host is openbabel.cheminfo.org ([b56eef2](https://github.com/cheminfo/openbabel.cheminfo.org/commit/b56eef28d75e191d114be53f869733a780733607))
* keep the input mode in the address ([9fa5743](https://github.com/cheminfo/openbabel.cheminfo.org/commit/9fa57439e2695961a656c27815d51398a6b672e0))
* read ChemDraw CDXML with Open Babel 3.2 ([e26cf37](https://github.com/cheminfo/openbabel.cheminfo.org/commit/e26cf370944cd01c333211a7473f9d2ffcfc273d))

## [1.2.0](https://github.com/cheminfo/openbabel/compare/v1.1.0...v1.2.0) (2026-04-20)


### Features

* migrate to current standards ([dfefae1](https://github.com/cheminfo/openbabel/commit/dfefae109c53d5f8428b770517c16dcde2f2d600))


### Bug Fixes

* describe of outputFormats route ([7995af5](https://github.com/cheminfo/openbabel/commit/7995af5aa7f8c4d9d7a32581f48a3f2b1a67c00e))
* throw error is failed conversion ([574af4c](https://github.com/cheminfo/openbabel/commit/574af4c50e3a961609a705fc2f7bb15c4fde2fc6))

## [1.1.0](https://github.com/cheminfo/openbabel-docker/compare/v1.0.1...v1.1.0) (2022-12-14)


### Features

* add convert route ([1ba8ef3](https://github.com/cheminfo/openbabel-docker/commit/1ba8ef3f65ce920297833c9d7065c6280803e794))

## [1.0.1](https://github.com/cheminfo/openbabel-docker/compare/v1.0.0...v1.0.1) (2022-08-09)


### Bug Fixes

* output format ([63030ad](https://github.com/cheminfo/openbabel-docker/commit/63030add4fa0ec5b05a213ed7e36e702ea822674))
* ph as a string ([a58f94b](https://github.com/cheminfo/openbabel-docker/commit/a58f94be97b8bbf3671ca36fd3417f1c8d650a66))
* route with outputFormats ([8ab5c8d](https://github.com/cheminfo/openbabel-docker/commit/8ab5c8da8e243c3773e1d78517ad2dc0477b7e13))
* schema and descrption ([0380a50](https://github.com/cheminfo/openbabel-docker/commit/0380a50b83cbeac1af75ee8f3549e64cb4a1817f))

## 1.0.0 (2022-08-09)


### Features

* add input and output formats route ([3f13fe3](https://github.com/cheminfo/openbabel-docker/commit/3f13fe3ba337d2b4703c638544294e4f215fed07))
* first release with docker-compose example ([7db6dd1](https://github.com/cheminfo/openbabel-docker/commit/7db6dd17309b1136c26aadfb660e487bddff200f))


### Bug Fixes

* bot token ([aa9d2fe](https://github.com/cheminfo/openbabel-docker/commit/aa9d2fe72e34bcd49267dc4febc22f55c4beaf34))
* release branch ([ba70aa5](https://github.com/cheminfo/openbabel-docker/commit/ba70aa5233bad5af07245d439dee40a27f949260))
