---
title: Privacy Accounting methods
date: "2022-04-02T18:46:37.121Z"
template: "post"
draft: false
slug: "privacy_accounting"
category: "research"
tags:
  - "research"
description: "差分プライバシの合成定理について俯瞰してみる．"
---

差分プライバシの合成定理について俯瞰してみる．

#### 目次
1. [準備](#index_preliminaries)
1. [Moments Accountant](#index_moments_accountant)
1. [Renyi Differential Privacy](#index_rdp)

---

<a id="index_preliminaries"></a>

# 準備

$D, D'$を隣接データベース，$(\epsilon_i, \delta_i)$を$(\epsilon_i, \delta_i)$-DPを満たすメカニズム $\mathcal{A}_i$ のプライバシバジェットとし，$\mathcal{A}_i$ から得られる出力を $z_i$ とする．

$\mathcal{A}_i$ $(i\in [k])$ から得られた結果 $z_i$ を公開する場合，差分プライバシの保証は，隣接データベースに対する識別確率，つまり，

$$
\frac{\Pr[\mathcal{A}_i(D)=z_i]}{\Pr[\mathcal{A}_i(D')=z_i]} 
$$

の $i\in [k]$ に対する同時分布によって決まる．
複数のメカニズムに対する差分プライバシの保証を考えるためには，この分布の振る舞いを観察する必要がある．

差分プライバシにおけるプライバシ消費の *合成定理* は，$(\epsilon_i, \delta_i)$-DPを満たす $k$ 個のメカニズムに対しては，$(\sum^k{\epsilon_i}, \sum^k{\delta_i})$-DPを保証する *Sequential Composition* が基本になる．
これは，それぞのメカニズム $\mathcal{A}_i$ から漏れてしまう識別確率の同時分布

$$
\frac{\prod^k_{i=1}\Pr[\mathcal{A}_i(D)=z_i]}{\prod^k_{i=1}\Pr[\mathcal{A}_i(D')=z_i]} \tag{1}
$$

が，*Union Bound* によって上から抑えられることから理解できる．
基本的に，Union Boundは任意の確率分布に対して成立すると思うけど，かなり大雑把なバウンドしか与えられない．

プライバシ消費の合成は，いかにこの同時分布から起こる識別確率を下げるか，という作業に帰着する．
差分プライバシでは任意の攻撃を仮定するので，当然，その上界を調べることになる．
技術的(数学的)には，独立な確率分布の積や和をいかにタイトに上から抑えられるか，とも言える．
つまり，これらの研究の一般的な方法論としては，DPを満たす(もしくはなんらかのランダムネスを持つ)メカニズムに基づく識別可能性を確率変数とし，その確率変数の満たすいろいろな性質(e.g., 独立性，期待値のバウンド，サブガウシアン etc.)を用いて，できるだけタイトな上界を示す，という流れとなる．
メカニズムや様々な設定(e.g., ノイズの分布，kの数 etc.)によって，いろんな合成が有効だったりして，いまのところ，全てにこれを使っておけば良い，というようなものは存在しない，という認識．
ただし，メカニズムとほぼセットなので(証明を含むため)，いろんな合成を試す必要がある場面というのは，ほぼないと思われる．


実際に，Sequntial Composition と比較してもっと賢く(タイトに)同時分布を見積もることができる方法を１つ見てみる．

いま，以下のような，*Privacy Loss* $(\mathrm{PL})$ という確率変数を考える．ただし，$\mathcal{A}$ はあるメカニズム．

$$
\mathrm{PL} = \log{\cfrac{\Pr[\mathcal{A}(D)=z]}{\Pr[\mathcal{A}(D')=z]}},\;\; \mathrm{w.p.}\; \Pr[\mathcal{A}(D)=z] \tag{2}
$$

Privacy Lossは(1)のように識別不能性を示しており，$\mathrm{PL} \le \epsilon $ ならば $\mathcal{A}$ は $\epsilon$-DPを満たすと言える．
ただし，対数をとっているため，同時分布は $\mathrm{PL}$ の和となる．
この Privacy Loss の和 $\sum^k_{i=1}{\mathrm{PL}}$ (cummulative PL)が $\epsilon'$ より大きくなってしまう場合の測度を $\delta'$ とすることで，$(\epsilon', \delta')$-DP を保証することが可能である．
よって，$\Pr[\sum^k_{i=1}{\mathrm{PL}} \gt \epsilon']$ をタイトにバウンドすることが目標となる．
実際に $\sum^k_{i=1}{\mathrm{PL}}$ の分布を観察すると，多くのメカニズムで測度集中があることが分かり， $\delta'$ は小さく抑えられるケースがある．

例えば，$(\epsilon, 0)$-DPを満たす $k$ 個のメカニズムがあった場合を考える．
この時，任意の $\epsilon, \delta, \delta' \ge 0$ に対して，$k$ 個の
メカニズムは，$(\epsilon', k\delta+\delta')$-DPを満たす．ただし 

$$
\epsilon' = \sqrt{2k\ln{1/\delta'}}\epsilon + k\epsilon(e^{\epsilon} - 1) \tag{3}.
$$

これは *Advanced composition* として知られ，$k$が結構大きい場合は，普通の合成よりもタイトな境界を与える．


証明のスケッチとしては，(フォーマルな証明は [[1](#cite_privacybook)] のTh.3.20を参照．)

(1) 確率変数 $\mathcal{A}_i(D)$ と $\mathcal{A}_i(D')$に対して，KL-Divergenceを計算すると，

$$
\int_{-\infty}^{\infty} \Pr[\mathcal{A}_i(D)=z] \log{\cfrac{\Pr[\mathcal{A}_i(D)=z]}{\Pr[\mathcal{A}_i(D')=z]}}dz
$$

であり，これは，$\mathrm{PL}_i$ の期待値となる．

(2) $\epsilon$-DPから，$\mathcal{A}_i(D)$ と $\mathcal{A}_i(D')$ の Max Divergnece を経由して，KL-Divergence の上界が $\epsilon(e^{\epsilon} - 1)$であることを示す．すなわち $\mathrm{PL}_i$ の上界を与える．

(3) Azumaの不等式を用いて，$\mathrm{PL}_i$の和に対する上界を与える．$\Pr\left[\sum{\mathrm{PL}_i} > \epsilon'\right] < \delta' $ に帰着するように適当なパラメータを選ぶ．と (3) の結果が得られる．


だいたいこのような流れで Privacy Loss 確率変数の和の上界を求めていく．
Advanced compositionでは，KL-Divergenceの上界の部分や，Azumaの不等式などが全然タイトではないため，まだまだルーズな上界となってしまっていることがなんとなく感じられる．
これは，確率変数に対する仮定が非常に一般的であるため([Azuma's ineq](https://en.wikipedia.org/wiki/Azuma%27s_inequality) の確率変数に対する前提条件は，確率過程の差分がある定数でバウンドされたマルチンゲールであること，であり，DPのPrivacy Lossではほぼほぼ一般的に満たされるはず．)に，利用できる性質が乏しいというのが一因であると思われる．
したがって，下に紹介する合成方法では，より強く，限定的な仮定に基づいて Privacy Loss を解析することでタイトな上界を示すことができるという構造になっている．

---

<a id="index_moments_accountant"></a>

# Moments Accountant [[2](#cite_ma)]

[[2](#cite_ma)] は非常に人気のある研究で，Moments Accountantと呼ばれる合成方法を用いた *DP-SGD* というとても有名なアルゴリズムを提案している．
DP-SGDは差分プライバシを満たしながら，経験的リスク最小化問題を解くためのフレームワークであり，SGDによって得られた統計量 (i.e., モデル) が勝手に差分プライバシを満たすという非常に便利な代物である．

アルゴリズムはとても単純で，SGDの各微分ステップで得られた勾配にランダムノイズを乗せる．
そのノイズが乗った勾配を用いてモデルの更新を行う．
ランダムノイズは基本的にガウス分布からサンプリングされる．
ガウス分布のパラメータを決定するためには，プライバシバジェット $(\epsilon, \delta)$ に加えて，勾配ベクトルの *sensitivity* を決定すればよい．
勾配の *L2-sensitivity* を有限にするために，勾配のL2ノルムが定数になるように数値をカットして丸め込む．
これを *gradient clipping* と呼ぶ．
そうすることで，任意のDPを満たすランダムノイズ生成するガウス分布を決定することができるようになる．

ただし，ここはこの論文の重要な貢献ではなく，次の合成が重要である．
なぜなら，SGD ではイテレーションが重要であり，メカニズムを適用する回数が非常に多くなる可能性がある．
よってSequential Compositionで考えると，必要なプライバシバジェットが極端に多くなってしまう可能性があり，結果として差分プライバシの満たすプライバシ性はほとんどなくなってしまうかもしれない．

ここでの合成のキーアイデアは，サンプリングと Privacy Loss の確率変数の性質としてモーメント母関数を利用する点である．

TODO: 詳しく説明する

<img src="/post-img/accounting_privacy/advanced-vs-ma.png" alt="Advanced composition vs moments accountant" width="320" height="250">

実は，漸近的な改善はAdvanced compositionと比べて対して大きくないかもしれない．
具体的には，ガウス分布の分散を$1/\sqrt{\log{(T/\delta)}}$にしただけと見ることができる．($T$は試行回数)
それよりも，SGDにおけるデータのサンプリングが，プライバシのAmplificationに使えるという従来からあったテクニックをうまく取り入れたという点の方が合成の結果に対して貢献度が大きい．

---

<a id="index_rdp"></a>

# Renyi Differenital Privacy [[3](#cite_rdp)]

TODO: 説明する

---



### 参考文献
<a id="cite_privacybook"></a>
[1] Dwork, Cynthia, and Aaron Roth. "The algorithmic foundations of differential privacy." Found. Trends Theor. Comput. Sci. 9.3-4 (2014): 211-407.

<a id="cite_ma"></a>
[2] Abadi, Martin, et al. "Deep learning with differential privacy." Proceedings of the 2016 ACM SIGSAC conference on computer and communications security. 2016.

<a id="cite_rdp"></a>
[3] Mironov, Ilya. "Rényi differential privacy." 2017 IEEE 30th computer security foundations symposium (CSF). IEEE, 2017.