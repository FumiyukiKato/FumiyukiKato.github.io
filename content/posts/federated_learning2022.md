---
title: Federated Learning Researches in 2022
date: "2022-04-05T18:46:37.121Z"
template: "post"
draft: false
slug: "federated learning"
category: "research"
tags:
  - "research"
description: "2022年4月時点でのFederated Learningの研究動向について俯瞰してみる．特にセキュリティ・プライバシ．"
---

2022年4月時点でのFederated Learningの研究動向について俯瞰してみる．


## Federated Learning研究におけるメイントピック
[[1](#cite_survey1)] によると，現在のFLの課題は主に以下の5つに分類される．
### Communication cost
- 無線環境のエッジデバイスでは特に帯域幅が厳しい
- uplinkはdownlinkよりも遅い
- モデルのパラメータが大きくなりがち

#### 一般的な解決策
- 学習のラウンド数を減らす
  - 高い収束性をもつ最適化アルゴリズムの利用
- 1ラウンドあたりのコミュニケーションコストを減らす
  - パラメータのスパース化


### Heterogeneity in systems
- FLの学習への参加者のデバイスが様々である (e.g., 計算能力，通信能力，ストレージ...) 
  - 耐障害性が低くなりがち
  - ネットワークの遅延によって学習の同期に問題が起こりやすい
  - ユーザの選択や，一様サンプリングが困難 (差分プライバシの厳密な評価などに影響が出る)
#### 一般的な解決策
- 学習に有用な・積極的なユーザを適切に選別する

### Heterogeneity in statistical
- データがユーザごとにnon IIDであり，モデリングが難しい場合がある
  - 単純な *分散型のSGD* では確率的勾配が不偏とならなくなる

#### 一般的な解決策
- non IIDデータに適した学習アルゴリズムを適用する
- 勾配のtop-k スパース化が有効という結果も


### Privacy concerns
- 

### Security vulnerabilities


---
### 参考文献
<a id="cite_survery1"></a>
[1] Challenges and future directions of secure federated learning: a survey
