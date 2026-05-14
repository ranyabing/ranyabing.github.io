---
title: "Agent奠基论文解读"
description: "梳理 Toolformer、ToolLLM、Voyager 与 Reflexion 等论文对 Agent 系统架构的关键启发。"
pubDate: 2026-05-14
tags: ["llm", "agent", "论文"]
draft: false
---

## Tool Use 两篇论文

### Toolformer: Language Models Can Teach Themselves to Use Tools

这篇文章启发了一个方向：大模型不应被设计成“全能知识容器”，而应被训练成“能判断何时调用外部能力的语言控制器”。

这篇论文里的训练目标发生了变化。传统语言模型训练主要是：给定前文，预测下一个 token。Toolformer 仍然做语言模型训练，但它额外让模型学会一种行为：给定上下文，判断是否需要 API，生成 API 调用，使用 API 返回结果，再继续生成文本。

这篇文章的价值，不只是提出“模型可以用工具”，而是把工具调用从工程技巧推进到训练目标：模型要学会何时调用、调用哪个 API、如何构造参数、如何吸收返回结果并继续生成。论文明确说，Toolformer 通过少量 API 示例和自监督数据构造，让模型学会使用计算器、问答系统、搜索引擎、翻译系统和日历等工具。

Toolformer 把“工具有用”定义成“能降低后续 token loss”，但 loss 更低不等于调用语义正确。

- 它假设“原文后续 token”就是监督信号，但今天看，这个假设太弱，很多工具调用的价值不体现在已有文本后续 token 中。
- 它学习的是“插入式工具调用”，不是“任务级工具使用”，今天的工具调用是 agent loop。
- 它不能自然处理链式工具调用，也就是它不能把一个工具输出作为另一个工具输入。
- 它把工具调用当成文本生成，而现代系统把工具调用当成结构化动作。

站在 2026 年，Toolformer 显得别扭，是因为它用一个非常“语言模型内部”的指标，去解决一个今天已经变成“外部执行系统”的问题。

更准确地评价是：Toolformer 是工具调用从“语言建模”走向“行动系统”的过渡形态。

### ToolLLM: Facilitating Large Language Models to Master 16000+ Real-world APIs

ToolLLM 是 agent 数据工程的萌芽。这篇论文的认识是：工具调用不是普通指令微调的自然产物，它需要专门构造工具调用数据集。

Toolformer 从原始语料中自动挖工具调用样本；ToolLLM 用强模型和真实 API 自动合成大规模工具调用轨迹数据。前者是 self-supervised filtering，后者是 teacher-generated trajectory distillation。

ToolLLM 需要 API 检索器从海量 API 中筛选候选工具；需要多步搜索机制，而不是只走一条 ReAct 路径；开源模型可以通过大规模工具轨迹微调，逼近 ChatGPT/GPT-4 的工具调用能力。

DFSDT 是 Depth First Search-based Decision Tree，也就是深度优先搜索决策树。它把工具调用过程看成一棵搜索树，这是针对 ReAct 方法提出的另一条思路：一旦早期 API 调错，后面容易持续错误。ToolLLM 继承了 ReAct 的基本格式，但它认为 ReAct 单路径不足，于是用 DFSDT 扩展为搜索树。

ToolLLaMA 是在 LLaMA-2 7B 上微调得到的。输入是用户指令和 API 文档；输出是工具调用轨迹和最终答案。

Toolformer 证明模型可以学会用工具；ToolLLM 证明开源模型可以通过大规模真实 API 轨迹训练，获得接近闭源模型的工具调用能力。

## Skills 论文

### Voyager: An Open-Ended Embodied Agent with Large Language Models

站在 2026 年看，Voyager 验证了一件事：模型不必端到端学会所有行为；它可以作为规划器或代码生成器，借助工具、环境反馈、外部记忆和自我修正，在部署过程中持续积累能力。

Voyager 的几个关键启发：

- LLM 可以作为 agent 的中枢控制器。Agent 的“智能”不完全在模型权重里，而在模型、工具、记忆、执行环境和调度循环的系统组合里。
- 代码是比自然语言更好的 agent 行动表示。后来软件工程 agent、浏览器 agent、数据分析 agent、RPA agent，基本都沿用了这个思想。
- Agent 需要长期记忆，但记忆最好不是聊天记录，而是可调用的能力。长期记忆最有价值的形式不是“我曾经做过什么”，而是“我以后能直接调用什么”。
- 闭环执行比单轮推理重要。这个循环后来变成 agent 的标准形态：观察环境，规划，调用工具，获得反馈，反思或修复，再行动。
- 自动 curriculum 是开放式 agent 的关键驱动器。这为后来的自我改进 agent、长期任务 agent、研究型 agent 提供了基础问题：不是只问“如何完成任务”，还要问“下一个最有信息增益的任务是什么”。
- Agent 的接口设计本身会决定上限。如果给 agent 一个结构化、稳定、可调试的动作空间，agent 能力会显著提升。
- “不训练模型，也能学习”是一条重要工程路径。Voyager 的学习不是参数学习，而是外部状态学习：技能库增长、prompt 改善、上下文检索增强、行为组合能力增强。

最准确的历史定位是：Voyager 是 LLM agent 从“提示词技巧”走向“系统架构”的标志性论文之一。

## 反思机制

### Reflexion: Language Agents with Verbal Reinforcement Learning

反思机制的本质，是外部反馈进入了推理循环。

LLM Agent 的有效学习，不一定发生在模型权重里，也可以发生在上下文、记忆、工具反馈和执行轨迹里。换句话说，它提前说明了 2023-2026 年 Agent 系统的一条主线：从“训练一个更聪明的模型”，转向“构造一个能试错、记忆、修正、复用经验的系统”。

“语言”可以成为强化学习中的中间表示。Reflexion 的主张是：如果底座模型足够强，那么失败反馈可以被转写成自然语言经验。2026 年的 Agent 工程大量采用类似范式：错误日志、执行轨迹、测试反馈、用户反馈、工具返回值，都被转成上下文或记忆，而不是每次都微调模型。

Agent 的能力来自闭环，不是单次生成。Reflexion 不是在说 prompt 写得更漂亮，而是在说：尝试，评估，反思，记忆，再尝试。这个闭环本身就是能力来源。

外部反馈比“自我感觉”重要。Reflexion 有效的根源不是“模型内省”，而是可验证反馈进入了推理循环。LLM 不擅长无依据地自我纠错，但擅长利用外部反馈重新组织推理。
