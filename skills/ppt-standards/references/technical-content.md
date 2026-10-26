# Technical content

Use these checks only for content present in the deck. They supplement the main skill's narrative and visual conventions.

## Source fidelity and abstraction

- Check implementation claims against the relevant current source or documented evidence. Use names and relationships the source actually defines. If evidence is unavailable, qualify the claim and record what could not be checked.
- Distinguish the system, its components, and their interfaces. A connector ending on a component's port should not be drawn as though it represents the entire component.
- Label operational boundaries and data movement explicitly when they explain the mechanism. A colored rectangle alone does not identify where computation runs or what crosses a boundary.
- Configuration names, scenario roles, and implementation types are different kinds of information. Do not turn a convenient example name into a built-in system category.
- Distinguish a common operation from per-instance inputs, coefficients, parameters, or state. “All inputs use the same operation” does not mean “all inputs receive the same parameters.”

## Connections and composed diagrams

- Work out the relationship set before drawing it: which objects connect, which endpoints they use, whether connections are directed, and which connections are omitted intentionally.
- For a complete bipartite example with M endpoints on one side and N on the other, there are M × N endpoint pairs. If both directions are represented independently, there are 2MN directed connections. Apply this only when that topology and counting convention actually match the source; do not assume every diagram is all-to-all.
- A bidirectional arrow can compress two directions visually. It does not by itself prove identical parameters, symmetric behavior, or shared state in those directions.
- If an all-to-all figure becomes unreadable, use a matrix, grouped connections with an explicit multiplicity, or separate views. Preserve the meaning and disclose the abstraction rather than silently dropping relationships.
- Keep repeated branches visibly separate. Label each branch or instance when the distinction matters; avoid assigning colors to merely decorative differences.
- A component-detail slide should preserve the enclosing block, label, and input/output interface used in the system overview. The audience should be able to substitute the detailed block into the overview mentally.
- If one slide distinguishes branches within one component and the next distinguishes independent components, do not reuse the same colors to mean both. Use a neutral style for internal repetition and an explicitly labeled palette for independent instances when that fits the explanation.

## Equations and symbols

- Match the equation's scope to the figure. An equation for one component should not silently contain an unexplained sum over several components absent from the diagram.
- When composition is the next concept, introduce it on the composition slide. Keep indices and operation order consistent with the earlier component equation.
- Define every unfamiliar symbol, index, and unit near its first use. Distinguish input, output, transformation, independent variable, component index, and aggregation index as applicable. Keep the same symbol's meaning stable.
- Arrange equations and definitions with a clear reading order and common alignment. Avoid tiny legends, awkward line breaks, or definitions touching nearby diagram blocks. A short definition row or aligned columns may work; neither is mandatory.
- Show only the notation needed for the slide's point. Move extended derivations to speaker notes or an appendix when requested or useful, without hiding assumptions needed to interpret the main claim.
- Verify subscripts, superscripts, operators, Greek letters, and mathematical fonts in the delivered rendering. Plain text that parses correctly is not proof of correct visual notation.

## Examples, evidence, and terminology

- Keep code and configuration excerpts consistent with the actual schema, identifiers, dimensionality, and behavior they claim to show. If an excerpt is illustrative or partial, label it accordingly. Do not present plausible pseudocode as a verified executable configuration.
- Remove an excerpt that adds effort without explaining the slide's point. Do not replace it with a different unsupported example merely to fill space.
- Label example dimensions and counts as examples. Keep the count in the caption, drawing, and explanation consistent.
- Support performance claims with the conditions needed to interpret them, such as workload, measurement units, hardware, baseline, duration, and source date or revision where relevant. Distinguish measured results, extrapolations, and planned capabilities.
- Replace unexplained implementation jargon with the concrete role it plays. Match terminology to the entity actually modeled; a system, component, endpoint, and data stream are not interchangeable.
- Explain limitations that change the interpretation of a result. Remove internal agent commentary, editing instructions, and unsupported claims of generality from audience-facing text.
