---
title: 差分プライバシの合成の基礎
date: "2022-04-02T18:46:37.121Z"
template: "post"
draft: false
slug: "privacy_accounting"
category: "research"
tags:
  - "research"
description: "差分プライバシの合成定理の基礎．Advanced Composition，Moments Accountant，Renyi DP．"
---

差分プライバシの合成定理の基礎について振り返る

#### 目次
1. [基本的な合成定理](#index_preliminaries)
1. [Moments Accountant](#index_moments_accountant)
1. [Renyi Differential Privacy](#index_rdp)

---

<a id="index_preliminaries"></a>

# 基本的な合成定理


$D, D'$ を隣接データベース，$(\epsilon_i, \delta_i)$を$(\epsilon_i, \delta_i)$-DPを満たすメカニズム $\mathcal{A}_i$ のプライバシバジェットとし，$\mathcal{A}_i$ から得られる出力を $z_i$ とする．
差分プライバシでは，２つのデータベース$D, D'$ に対する識別確率は，任意の出力値 $z_i$ $(\in Z)$ に対する出力確率の比の最大値で評価する．すなわち以下．

$$
\mathrm{max}_{z_i\in Z}\;  \left|\frac{\Pr[\mathcal{A}_i(D)=z_i]}{\Pr[\mathcal{A}_i(D')=z_i]}\right|
$$

これが任意の$D, D'$ に対して$e^{\epsilon}$で抑えられる場合に$\epsilon$-差分プライバシを満たす．

今，$k$個のメカニズム $\mathcal{A}_i$ $(i\in [k])$ から得られた結果 $\mathbf{z} = (z_1,...,z_k) \in \mathbf{Z}$ を公開する場合，差分プライバシの保証は，隣接データベースに対する識別確率の分布の全ての同時分布によって決まる．
つまり素朴に考えると，以下が識別確率となる．

$$
\mathrm{max}_{\mathbf{z}\in \mathbf{Z}}\; \left|\prod^k\frac{\Pr[\mathcal{A}_i(D)=z_i]}{\Pr[\mathcal{A}_i(D')=z_i]} \right| \tag{1}
$$


複数のメカニズムに対する差分プライバシの保証を考えるためには，この分布の振る舞いを観察する必要がある．

差分プライバシにおけるプライバシ消費の *合成定理* は，$(\epsilon_i, \delta_i)$-DPを満たす $k$ 個のメカニズムに対しては，$(\sum^k{\epsilon_i}, \sum^k{\delta_i})$-DPを保証する *Sequential Composition* が基本になる．
これは，それぞのメカニズム $\mathcal{A}_i$ から得られる出力に対する隣接データベースの識別確率(1)が，以下のように上から抑えられることから理解することができる．


$\mathcal{A}_1, ... , \mathcal{A}_k$ から出力 $\mathbf{z} = (z_1,...,z_k)$ が$D$から得られる確率$\Pr[D, \mathbf{z}]$について考える．
$\mathcal{A}_i$を実行する際には，$\mathcal{A}_1, ... , \mathcal{A}_{i-1}$までの出力結果を観測できるため，以下のように書くことができる．
$$
\Pr[\mathbf{z}, D] = \prod_{i\le k}\Pr[\mathcal{A}_i(D)=z_i|z_1,...,z_{i-1}]
$$
$\mathcal{A}_i$ は$(\epsilon, \delta)$-DPを満たすので，以下のような不等式が成立する．
$$
\begin{align*}
\prod_{i\le k}\Pr[&\mathcal{A}_i(D)=z_i|z_1,...,z_{i-1}]
\\ &\le \prod_{i\le k}{\left(\exp(\epsilon) \times \Pr[\mathcal{A}_i(D')=z_i|z_1,...,z_{i-1}] \right)} + \delta * k
\\ &= \exp(\epsilon k) \Pr[\mathbf{z}, D'] + \delta * k
\end{align*}
$$
1行目は，$\mathcal{A}_i$が$(\epsilon, \delta)$-DPを満たすため，と，各$i$の$\Pr[\mathcal{A}_i(D)=z_i|z_1,...,z_{i-1}]$は確率であるため，少なくとも1で上から抑えることができる．
分かりにくいので，これをちょっと説明する．
$\Pr[\mathcal{A}_i(D)=z_i|z_1,...,z_{i-1}] = P(i)$，$\Pr[\mathcal{A}_i(D')=z_i|z_1,...,z_{i-1}] = P'(i)$とおくと，以下が成立する．
$$
\begin{align*}
P(i) &\le (\exp(\epsilon) \times P'(i)+ \delta) \land 1 
\\ &\le (\exp(\epsilon) \times P'(i) ) \land 1 + \delta
\end{align*}
$$
また，全ての$i$に対する，$\mathcal{A}_i$と$\mathcal{A}_{i+1}$の関係として，以下が成立．(不等式の順番が大事そうなのでめちゃめちゃ細かく書いている.)
$$
\begin{align*}
P(i)P(i+1) &\le (\left\{\exp(\epsilon) \times P'(i)\land 1\right\}  + \delta) \times P(i+1)
\\ &\le \left\{\exp(\epsilon) \times P'(i)\land 1 \right\} \times P(i+1) + \delta
\\ &\le \left\{\exp(\epsilon) \times P'(i)\land 1 \right\} \times \left\{\exp(\epsilon) \times P'(i+1) + \delta \right\} + \delta
\\ &\le \left\{\exp(\epsilon) \times P'(i)\land 1 \right\} \times (\exp(\epsilon) \times P'(i+1))
\\ &\quad + \left\{\exp(\epsilon) \times P'(i)) \land 1\right\} \times \delta + \delta
\\ &\le \exp(2\epsilon)P'(i)P'(i+1) + 2\delta
\end{align*}
$$
これを適用していくことで，上の $\delta * k$ のところが成立する．
何はともあれ，$\Pr[\mathbf{z}, D']$は隣接データベースに対するメカニズムの出力の同時分布になっていて，最初の不等式は差分プライバシの定義通りになっていることが分かる．

ちなみにこの証明を見ると，タイトさよりも直感的な形式にすることを優先して，$(\sum^k{\epsilon_i}, \sum^k{\delta_i})$-DPという形に無理矢理合わせるような証明になっていて，結構気持ち悪い感じはする．

プライバシ消費の合成は，いかにメカニズムの出力の同時分布の比の最大値，つまり識別確率，を小さくするか，という作業に帰着する．
技術的(数学的)には，独立な確率分布の積や和をいかにタイトに上から抑えられるか，とも言える．
したがって，これらの研究の一般的な方法論としては，DPを満たす(もしくはなんらかのランダムネスを持つ)メカニズムに基づく識別可能性を確率変数とし((1)の絶対値の中身のようなもの)，その確率変数の満たすいろいろな性質(e.g., 独立性，期待値のバウンド，期待値のサブガウシアン性 etc.)を用いて，できるだけタイトな上界を示す，という流れとなる．
メカニズムや様々な設定(e.g., ノイズの分布，kの数 etc.)によって，いろんな合成が有効だったりして，いまのところ，全てにこれを使っておけば良い，というようなものは存在しない，という認識．


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

[[1](#cite_privacybook)]のTh.3.3のAzumaの不等式は[wikipedia](https://en.wikipedia.org/wiki/Azuma%27s_inequality)にある普通の形とちょっと違う．
$E[f]=X_0$,...,$E[f|x_1,...,x_{i}] = X_i$,...,$E[f|x_1,...,x_{k}] = X_k = f(x_1,...,x_k)$のように見るとにある通常のAzumaの不等式に対応させられる．
$X_i$は，i番目のデータまで($x_1,...,x_i$)が観測されて，残りのデータ($x_{i+1},...,x_k$)に対してのある関数fの期待値を表す．


だいたいこのような流れで Privacy Loss 確率変数の和の上界を求めていく．
Advanced compositionでは，KL-Divergenceの上界の部分や，Azumaの不等式などがタイトではないため，まだまだルーズな上界となってしまっていることがなんとなく感じられる．
これは，確率変数に対する仮定が非常に一般的であるために，利用できる性質が乏しいというのが一因であると思われる．
Azumaの不等式の確率変数に対する前提条件は，確率過程内の連続する確率変数の差分がある定数でバウンドされたマルチンゲールであること，であり，DPのPrivacy Lossではほぼほぼ一般的に満たされるはず．
したがって，下に紹介する合成方法では，より強く，限定的な仮定に基づいて Privacy Loss を解析することでタイトな上界を示すことができるという構造になっている．


*adaptive* という性質について説明しておく．
*adaptive* なk個のメカニズム$\mathcal{A}_i$ $(i \in [k])$とは，基本的には，$\mathcal{A}_i$は，$\mathcal{A}_1$から$\mathcal{A}_{i-1}$の出力結果($z_1,...,z_{i-1}$)を見てから出力されるという性質を言う．
これは，$\mathcal{A}_{i}=\mathcal{A}_{i}(z_1,...,z_{i-1}, x_i)$としてモデル化される．
基本的に，$\mathcal{A}_{i}(z_1,...,z_{i-1}, x_i) = \mathcal{A}_{i}(x_i)$が成立する場合は，Privacy Loss 確率変数は，adaptiveな場合もそうでない場合も同じ分布に従うことになる．

TODO: privacy filter系の内容について書く．


---

<a id="index_moments_accountant"></a>

# Moments Accountant [[2](#cite_ma)]

[[2](#cite_ma)] は非常に人気のある研究で，Moments Accountantと呼ばれる合成方法を用いた *DP-SGD* というとても有名なアルゴリズムを提案している．
DP-SGDは差分プライバシを満たしながら，経験的リスク最小化問題を解くためのフレームワークであり，SGDに従う最適化によって得られた統計量 (i.e., モデル) が勝手に差分プライバシを満たすという非常に便利なアルゴリズムである．

<img src="/post-img/accounting_privacy/dp-sgd.png" alt="DP-SGD overview" width="100" height="150">

アルゴリズムはとても単純で，SGDの微分ステップで得られた勾配にランダムノイズを乗せる．
そのノイズが乗った勾配を用いてモデルの更新を行う．
これは，勾配が元データに対するクエリとして考えると，一般的なDPのコンテキストとして理解しやすい．
DP-SGDでは，$L$をグループサイズ，$N$をデータの数として，$q=L/N$の確率で各データを独立にサンプリングする．
勾配はグループ内で合計値に対してノイズが加算され，グループ内で平均化される．


ランダムノイズは基本的にガウス分布からサンプリングされる．
ガウス分布のパラメータを決定するためには，プライバシバジェット $(\epsilon, \delta)$ に加えて，公開される勾配の *sensitivity* を決定すればよい．
勾配の *L2-sensitivity* を有限にするために，勾配のL2ノルムが定数になるように数値をカットして丸め込む．
これを *gradient clipping* と呼ぶ．
そうすることで，特定のDPを満たすガウス分布を決定することができるようになる．
*gradident clipping*もランダムノイズの付加も，機械学習の文脈では，オーバーフィッティングを防ぐために結構研究されてきて，ある程度の精度も見込まれるので，そのことからもDP-SGDが使い勝手の良いものであることがうかがえる．


この論文の貢献としては，本質的には，この記事のテーマである合成が重要である．
なぜなら，SGD では最適化中のイテレーションが重要であるためメカニズムを適用する回数が非常に多くなる可能性がある．
よってSequential Compositionで考えると，必要なプライバシバジェットが極端に多くなってしまう可能性があり，結果として差分プライバシの満たすプライバシ保証はほとんどなくなってしまうかもしれない．

Moments Accountantでの合成のキーアイデアは，サンプリングとGaussian Mechanismを組み合わせた2ステップに対する Privacy Loss 確率変数の性質としてモーメント母関数を利用する点である．

今，Privacy Lossを以下のように定義する．
$$
c(z; \mathcal{A}, \mathrm{aux}, D, D') := \log{\cfrac{\Pr[\mathcal{A}(\mathrm{aux}, D)=z]}{\Pr[\mathcal{A}(\mathrm{aux}, D')=z]}}. \tag{4}
$$
$\mathrm{aux}$は *adaptive* なメカニズムのモデル化で，$\mathcal{A}$ より前に実行されたアルゴリズムの出力を表す．

次に，$\mathcal{A}$ に対する，$\lambda$次のモーメント$\alpha_{\mathcal{A}}(\lambda; \mathrm{aux}, D, D')$を$\lambda$をパラメータとするキュムラント母関数として，以下のように定義する．
$$
\alpha_{\mathcal{A}}(\lambda; \mathrm{aux}, D, D') := \log{\mathbb{E}_{z\sim \mathcal{A}(\mathrm{aux}, D)}}[\exp(\lambda c(z; \mathcal{A}, \mathrm{aux}, D, D'))]. \tag{5}
$$
また，このキュムラント母関数の$\mathrm{aux}, D, D'$に対する最大を，以下のようにしておく．
$$
\alpha_{\mathcal{A}}(\lambda) := \max_{\mathrm{aux}, D, D'} \alpha_{\mathcal{A}}(\lambda; \mathrm{aux}, D, D'). \tag{6}
$$
この時，以下の２つの定理が成立する．

**Composability**
$\mathcal{A}$ は，k個のadaptiveなメカニズム$\mathcal{A}_1,...,\mathcal{A}_k$ から成るとする．この時，任意の$\lambda$ に対して，以下が成立する．
$$
\alpha_{\mathcal{A}}(\lambda) \le \sum^{k}_{i=1}{\alpha_{\mathcal{A}_i}(\lambda)}
$$
これは，$c(z_{1:k}; \mathcal{A}_{1:k}, z_{1:k-1}, D, D') = \sum_{i=1}^k c(z_i; \mathcal{A}_{i}, z_{1:i-1}, D, D')$であることと(5)から明らかである．
(証明終わり)

**Tail bound**
任意の$\epsilon > 0$に対して，メカニズム $\mathcal{A}$ は 以下の$\delta$を用いて，$(\epsilon, \delta)$-DPを満たす．
$$
\delta = \min_{\lambda}{\exp(\alpha_{\mathcal{A}}(\lambda) - \lambda \epsilon)}
$$
こちらの証明は，Chernoffの不等式を利用して証明する．
プライバシロス確率変数 $c(z)$ と$\epsilon > 0$に対して，以下が成立する．
$$
\begin{align*}
\Pr_{z\sim \mathcal{A}(D)}[c(z)\ge \epsilon] &= \Pr_{z\sim \mathcal{A}(D)}[\exp(\lambda c(z)) \ge \exp(\lambda \epsilon)] \\
&\le \cfrac{\mathbb{E}_{z\sim \mathcal{A}(D)}[\exp(\lambda c(z))]}{\exp(\lambda \epsilon)} \\
&\le \exp(\alpha - \lambda \epsilon)
\end{align*}
$$
いま，$B=\{z| c(z) \ge \epsilon\}$とすると，全ての $Z$ に対して，以下が成立する．
$$
\begin{align*}
\Pr[\mathcal{A}(D)\in Z] &= \Pr[\mathcal{A}(D)\in Z \cap B^c] + \Pr[\mathcal{A}(D)\in Z \cap B] \\
&\le \exp(\epsilon) \Pr[\mathcal{A}(D') \in Z \cap B^c] + \Pr[\mathcal{A}(D) \in B] \\
&\le \exp(\epsilon) \Pr[\mathcal{A}(D') \in Z \cap B^c] + \exp(\alpha - \lambda \epsilon)
\end{align*}
$$
2行目は，$B$の構成からプライバシロス $c(z)$ が $\epsilon$ より小さいことから．
(証明終わり)

この2つの定理の意味するところは，1つ目の定理によって，メカニズム $\mathcal{A}$ に対するモーメントを上から抑えて，2つ目の定理によって，対応する$(\epsilon, \delta)$を計算するという流れである．

ポイントは，プライバシロス確率変数の広がりを，キュムラント母関数上の集中不等式で評価するところである．
プライバシロス変数を確率過程として，足し合わせたものをバウンドするAdvanced compositionとは，だいぶ方法が異なることがわかる．

残りの部分で重要になるのは，特定のメカニズムに対して，どのようにキュムラント母関数を計算し，上から抑えることができるのかという点である．
具体的には，DP-SGDで使用されるランダムサンプリング＋Gaussian Mechanismに対するキュムラント母関数の評価を考えていく．


摂動後の勾配の出力分布に対するプライバシロスを考える．

$D'= D \cup \{x'\}$とする．
一般性を失わず，$D$に対する勾配の分布を $\mu_0=\mathcal{N}(0, \sigma^2 C^2)$ と書ける．(本来，プライバシロスは多次元ガウス分布の比であるが，Gaussian Mechanismのガウス分布は全ての次元に等しく広がっているので，一次元で評価してもL2ノルムの最大値は同じであることから一般性は失わない．)
$D'$に対する勾配の分布は，$\mu_1=\mathcal{N}(C, \sigma^2 C^2)$を用いて $\mu=(1-q)\mu_0 + q\mu_1$ と書ける．
SGDの勾配計算ステップで，サンプリングされたグループ内に$x'$が含まれない場合は，$D$と$D'$に対する摂動後の勾配の分布は全く同じで $\mu_0$ になる．
これが起こる確率は，$1-q$である．
逆に，確率$q$で$x'$が含まれるとき，摂動後の分布は $\mu_1$ となる．

したがって，プライバシロスは，$\log{(\mu_0/\mu)}$，もしくは，$D$ と$D'$を入れ替えて$\log{(\mu/\mu_0)}$と書ける．
よって，$\alpha(\lambda)$の定義より，以下の$E_1$，$E_2$を用いて，$\alpha(\lambda)=\log{\max{(E_1, E_2)}}$と書ける．
$$
\begin{align*}
E_1 &= \mathbb{E}_{z\sim \mu_0}[(\mu_0(z)/\mu(z))^{\lambda}] 
\\ &= \mathbb{E}_{z\sim \mu_0}\left[\left(\frac{\mathcal{N}(0, \sigma^2 C^2)}{(1-q)\mathcal{N}(0, \sigma^2 C^2) + q\mathcal{N}(C, \sigma^2 C^2)}\right)^{\lambda}\right]
\\ E_2 &= \mathbb{E}_{z\sim \mu}[(\mu(z)/\mu_0(z))^{\lambda}] 
\\ &= (1-q)\mathbb{E}_{z\sim \mu_0}\left[\left((1-q) + q\frac{\mathcal{N}(C, \sigma^2 C^2)}{\mathcal{N}(0, \sigma^2 C^2)}\right)^{\lambda}\right] 
\\ &\quad \quad + q\mathbb{E}_{z\sim \mu_1}\left[\left((1-q) + q\frac{\mathcal{N}(C, \sigma^2 C^2)}{\mathcal{N}(0, \sigma^2 C^2)}\right)^{\lambda}\right]
\\ &= (1-q)\mathbb{E}_{z\sim \mu_0}\left[\left((1-q) + q\frac{\mathcal{N}(C, \sigma^2 C^2)}{\mathcal{N}(0, \sigma^2 C^2)}\right)^{\lambda}\right] 
\\ &\quad \quad + q\mathbb{E}_{z\sim \mu_0}\left[\left((1-q) + q\frac{\mathcal{N}(0, \sigma^2 C^2)}{\mathcal{N}(-C, \sigma^2 C^2)}\right)^{\lambda}\right]
\\ &= (1-q)\mathbb{E}_{z\sim \mu_0}\left[\left(1 + q(\frac{\mathcal{N}(C, \sigma^2 C^2)}{\mathcal{N}(0, \sigma^2 C^2)}-1)\right)^{\lambda}\right] 
\\ &\quad \quad + q\mathbb{E}_{z\sim \mu_0}\left[\left(1 + q(\frac{\mathcal{N}(0, \sigma^2 C^2)}{\mathcal{N}(-C, \sigma^2 C^2)}-1)\right)^{\lambda}\right]
\end{align*}
$$
あとはこれを計算すれば良い．


このあたりに実際の実装がある．
([参考 - 対応するコード](https://github.com/tensorflow/models/blob/31f1af580a21b302ec7bcf7e94be7dd1ffa38eaa/differential_privacy/privacy_accountant/tf/accountant.py#L315))
証明はできていないようだが，試行してみる限り常に$E2 \ge E1$っぽいようで，$E2$ だけを計算している．

気になる計算は以下の部分で，
([参考 - 対応するコード](https://github.com/tensorflow/models/blob/31f1af580a21b302ec7bcf7e94be7dd1ffa38eaa/differential_privacy/privacy_accountant/tf/accountant.py#L341))
ノイズのガウス分布の標準偏差を$\sigma C$としておくことで，clippingのサイズ(L2 norm)の大きさに関わらず，一定の値に評価されることが分かる．
$$
\begin{align*}
\mathbb{E}_{z\sim \mu_0}\left[\left(\frac{\mathcal{N}(C, \sigma^2 C^2)}{\mathcal{N}(0, \sigma^2 C^2)}-1\right)^{\lambda}\right] &= \sum_{i=0}^{\lambda}{\binom{\lambda}{i} (-1)^{t-i} \mathbb{E}_{z\sim \mu_0}\left[\left(\frac{\mathcal{N}(C, \sigma^2 C^2)}{\mathcal{N}(0, \sigma^2 C^2)}\right)^{i}\right]}
\\ &= \sum_{i=0}^{\lambda}{\binom{\lambda}{i} (-1)^{t-i} \int_{-\infty}^{\infty}{\exp{\left(\frac{-i}{2\sigma^2C^2}\left((x-C)^2 - x^2\right)\right)}}}
\\ &\quad \quad \quad \cdot \frac{1}{\sigma C\sqrt{2\pi}}\exp{\left(- \frac{x^2}{2 \sigma^2 C^2}\right)}dx
\\ &= \sum_{i=0}^{\lambda}{\binom{\lambda}{i} (-1)^{t-i} \exp{\left(i(i-1)/2\sigma^2\right)}}
\end{align*}
$$

あとは，二項展開などを地道に計算していくことで$E_2$は計算できる．

また，$\alpha(\lambda)$の上界の漸近的な解析も可能である．

いま，$||f(\cdot)||_2 \le 1$ を満たす関数 $f: D \rightarrow \mathcal{R}^p$ を考え，$\sigma \ge 1$ とし， $J$ を 確率 $q < \frac{1}{16\sigma}$ で 各値を$[n]$ からサンプリングした集合とする．
任意の正の整数 $\lambda \le \sigma^2 \ln{\frac{1}{q\sigma}}$ に対して，$\mathcal{A}(D) = \sum_{i \in J}{f(x_i)} + \mathcal{N}(0, \sigma^2\mathbf{I})$は，以下を満たす．
$$
\alpha_{\mathcal{M}}(\lambda) \le \frac{q^2\lambda (\lambda + 1)}{(1-q)\sigma^2} + O(q^3\lambda^3/\sigma^3)
$$
これは，頑張って計算すれば得られるが，証明は省略する．


下の図は，Advanced compositionと比べると，たくさんの回数イテレーションしてもmoments accountantの方がタイトな上界を与えることを示している．advanced compositionは+ samplingによって$1/q$になっている．

<img src="/post-img/accounting_privacy/advanced-vs-ma.png" alt="Advanced composition vs moments accountant" width="250" height="250">


[Moments accountantの実装](https://github.com/tensorflow/models/blob/31f1af580a21b302ec7bcf7e94be7dd1ffa38eaa/differential_privacy/privacy_accountant/tf/accountant.py)

---

<a id="index_rdp"></a>

# Renyi Differenital Privacy [[3](#cite_rdp)]

*Renyi DP* (RDP)は，確率分布を使わずに差分プライバシを語ることができる面白い手法で，プライバシロスの広がりを*Renyi divergence*上で評価することで強力な合成手法にもなりうる．

実際，多くのライブラリでもデファクトな手法として使われている．

[RDPの実装 - このあたり](https://github.com/google/differential-privacy/blob/75046f9b34cc683a77165794f7b3de9a550edc03/python/dp_accounting/rdp/rdp_privacy_accountant.py#L228)

合成に関しては，基本的にMoments Accountantと同等になるようで，最後の方でそれを確認してみる．

まず導入．

$\mathcal{R}$上の2つの確率分布 $P$ と $Q$ に対して，オーダー $\alpha > 1$の Renyi divergenceはこのように定義される．
$$
D_{\alpha}(P||Q) := \frac{1}{\alpha - 1} \log{\mathbb{E}_{x\sim Q}\left(\frac{P(x)}{Q(x)}\right)^{\alpha}}.
$$

Renyi divergenceは，$\alpha=1$の時，KL-divergenceと一致する．([ロピタルの定理を使った証明．](https://math.stackexchange.com/questions/2094621/proof-that-r%C3%A9nyi-divergence-kl-divergence-when-alpha-rightarrow-1))
$$
D_{1}(P||Q) := \mathbb{E}_{x\sim P}\log{\frac{P(x)}{Q(x)}}.
$$
$\alpha = \infty$ の時，
$$
D_{\infty}(P||Q) := \sup_{x\in support(Q)}\log{\frac{P(x)}{Q(x)}}.
$$
よって$\alpha = \infty$ の時は，$\epsilon$-DPとRenyi divergenceとの関係は，以下のようになる．
$$
D_{\infty}(f(D)||f(D')) \le \epsilon.
$$

ここで $(\alpha, \epsilon)$-RDPを以下のように定義する．

メカニズム $f: D \rightarrow \mathcal{R}$がオーダー $\alpha$ の$\epsilon$-RDPを満たす，つまり$(\alpha, \epsilon)$-RDPを満たすとは，任意の隣接データベース$D, D'$に対して以下を満たすことである．
$$
D_{\alpha}(f(D)||f(D')) \le \epsilon
$$

<!-- RDPには，本来のDPと同じく色んな好ましい性質がある．
- 識別不能性
- 任意の前提知識を持つ攻撃者を仮定
- ポストプロセッシング定理 -->

それでは，RDPを用いた合成定理を見ていく．

まず，$f: D\rightarrow \mathcal{R}_1$ を $(\alpha, \epsilon_1)$-RDPとし，$g: \mathcal{R}_1 \times D \rightarrow \mathcal{R}_2$ を $(\alpha, \epsilon_2)$-RDPとする．この時，メカニズム$(f, g)$は，$(\alpha, \epsilon_1 + \epsilon_2)$-RDPを満たす，とする．

いま，$h: D \rightarrow \mathcal{R}_1 \times \mathcal{R}_2$を $f$ と $g$ を逐次的に実行する関数とし，$X, Y, Z$ を 確率分布 $f(D)$, $g(X, D)$とその同時分布 $(X, Y)=h(D)$ とする．
$X', Y', Z'$ は隣接データベースに対する分布として定義する．
この時，以下のように合成定理が成立する．
$$
\begin{align*}
\exp[&(\alpha - 1) D_{\alpha}(h(D)||h(D'))]
\\ &= \int_{\mathcal{R}_1 \times \mathcal{R}_2}{Z(x, y)^{\alpha}Z'(x, y)^{1-\alpha}dxdy}
\\ &= \int_{\mathcal{R}_1} \int_{\mathcal{R}_2}{(X(x)Y(x, y))^{\alpha}(X'(x)Y'(x, y))^{1-\alpha}dydx}
\\ &= \int_{\mathcal{R}_1} X(x)^{\alpha}X'(x)^{1-\alpha} \left\{ \int_{\mathcal{R}_2} (Y(x, y))^{\alpha}(Y'(x, y))^{1-\alpha}dy\right\} dx
\\ &\le \int_{\mathcal{R}_1} X(x)^{\alpha}X'(x)^{1-\alpha}dx \cdot \exp{((\alpha - 1)\epsilon_2)}
\\ &\le \exp{((\alpha - 1)\epsilon_1)}\exp{((\alpha - 1)\epsilon_2)}
\\ &= \exp{((\alpha - 1)(\epsilon_1 + \epsilon_2))}.
\end{align*}
$$

次にRDPと$(\epsilon, \delta)$-DPとの関係を確認する．

$f$が$(\alpha, \epsilon)$-RDPを満たすメカニズムである時，任意の$0 < \delta < 1$に対して，$\left(\epsilon + \cfrac{\log{(1/\delta)}}{\alpha - 1}, \delta\right)$-DPを満たす．
これの証明は省略する(ヘルダーの不等式を使う．こここそが重要かも: TODO)が，[[3](#cite_rdp)] のProposition.4である．

しかし https://arxiv.org/pdf/2004.00010.pdf prop.12 などでよりタイトな解析が与えられているようである．
[[3](#cite_rdp)] の証明使われている，ヘルダーの不等式がややルーズっぽい？

残りの関心ごとは，RDPを満たす個々のメカニズムである．

論文ではRandomized Response，Laplace mechanism，Gaussian mechanismが紹介されている．
L2-sensitivityが1で分散が$\sigma^2$のGaussian Mechanismについて，RDPがどうなるかを見てみる．

$$
\begin{align*}
D_{\alpha}(\mathcal{N}(0, \sigma^2)&\,||\,\mathcal{N}(1, \sigma^2))
\\ &= \frac{1}{\alpha - 1}\log{\int_{-\infty}^{\infty}{\frac{1}{\sigma\sqrt{2\pi}}\exp(-\alpha x^2/2\sigma^2)}}
\\ &\quad \quad \quad \cdot \exp(-(1-\alpha)(x-1)^2/2\sigma^2)dx
\\ &= \alpha / 2\sigma^2
\end{align*}
$$
Gaussian Mechanismは，$(\alpha, \alpha/2\sigma^2)$-RDPを満たす．

RDPのその他の特徴
- RDPはいかなる，純粋な$\epsilon$-DPを満たさない
- $\epsilon, \delta$のトレードオフを決定しやすい



RDPとMoments accountantsとの関係をGaussian Mechanismを用いて眺めてみる．

Moments accountantsでサンプリング確率$q=1$として考える．
L2-sensitivityが1のクエリに対して，分散 $\sigma^2$ をもつGaussian Mechanismを $k$ 回実行した時に対するトータルの $(\epsilon, \delta)$ をそれぞれの合成方法で計算してみる．

**RDP**

RDPでは，$k$ 回のGaussian Mechanismに対して，$(\alpha, k\alpha / 2\sigma^2)$-RDPを満たす．
これに対して，$\epsilon$ に対応する $\delta$ を計算すると，
$$
k\alpha / 2\sigma^2 + \frac{\log(1/\delta)}{\alpha - 1} = \epsilon \\
$$
より，
$$
\delta = \exp\left((\alpha - 1)(k\alpha / 2\sigma^2 - \epsilon)\right)
$$

**Moments Accountant**

Moments Accountantでは，$k$ 回のGaussian Mechanismに対するキュムラント母関数 $\alpha(\lambda)$ は，
$$
\begin{align*}
\alpha(\lambda) &\le k\log{\mathbb{E}_{z\sim \mu_0}[(\mu_1(z)/\mu(z))^{\lambda}]}
\\ &= k \log \int \exp\left(-\frac{\lambda}{2\sigma^2}(x^2 - (x-1)^2)\right) 
\\ & \quad \quad \quad \cdot \frac{1}{\sigma\sqrt{2\pi}}\exp(-\frac{x^2}{2\sigma^2})dx
\\ &= \frac{k\lambda(\lambda + 1)}{2\sigma^2}
\end{align*}
$$
と評価でき，
$$
\begin{align*}
\delta &= \min_{\lambda}\exp\left(k\lambda(\lambda + 1) /2\sigma^2 - \epsilon \lambda \right)
\\ &= \min_{\lambda}\exp\left(\lambda(k(\lambda+1) /2\sigma^2-\epsilon)\right)
\\ &= \min_{\lambda}\exp\left((\lambda-1)(k\lambda /2\sigma^2-\epsilon)\right)
\end{align*}
$$
となる．

よってRDPとMoments Accountantは同等であることが分かる．


[[4](#cite_rdp)] では，RDPとサブサンプリングについての解析が研究されている．これはMoments Accountantよりも厳密にタイト(？)

---



### 参考文献
<a id="cite_privacybook"></a>
[1] Dwork, Cynthia, and Aaron Roth. "The algorithmic foundations of differential privacy." Found. Trends Theor. Comput. Sci. 9.3-4 (2014): 211-407.

<a id="cite_ma"></a>
[2] Abadi, Martin, et al. "Deep learning with differential privacy." Proceedings of the 2016 ACM SIGSAC conference on computer and communications security. 2016.

<a id="cite_rdp"></a>
[3] Mironov, Ilya. "Rényi differential privacy." 2017 IEEE 30th computer security foundations symposium (CSF). IEEE, 2017.

<a id="cite_subsample_rdp"></a>
[4] Wang, Yu-Xiang, el al. "Subsampled rényi differential privacy and analytical moments accountant." The 22nd International Conference on Artificial Intelligence and Statistics. PMLR, 2019.