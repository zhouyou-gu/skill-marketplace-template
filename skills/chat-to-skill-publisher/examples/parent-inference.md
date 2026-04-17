# Example: Parent Inference

This example shows how the draft step classifies existing marketplace skills before the user confirms `parents`.

## Setup

- Draft topic: "scaffold AGENT files for a thesis-chapter revision workflow".
- `marketplace_local_path` resolves to a clone of `skill-marketplace-template` containing these existing skills:
  - `agent-files` — generic AGENT.md / AGENT_GOAL.md / AGENT_HARNESS.md / AGENT_PROGRESS.md scaffold
  - `manuscript-revision-agent-files` — LaTeX IEEE manuscript-revision AGENT scaffold with optional `REVISION_TASK.md`
  - `research-goal-curator` — post-scaffold curator for an existing `AGENT_GOAL.md`
  - `skill-link` — parent/child dependency graph builder
  - `chat-to-skill-publisher` — this skill

## Classification

| Existing skill | Class | Rationale |
| --- | --- | --- |
| `agent-files` | parent_candidate | The draft scaffolds the same four AGENT files and reuses the immutable-`AGENT_GOAL.md` rule; this draft specializes `agent-files`. |
| `manuscript-revision-agent-files` | overlap_warning | Thesis-chapter revision overlaps heavily with manuscript revision; ask the user whether to narrow the draft (chapter-only) or abandon it in favor of extending `manuscript-revision-agent-files` instead. |
| `research-goal-curator` | unrelated | The draft writes the goal file as part of scaffolding; it does not curate an existing goal file. |
| `skill-link` | unrelated | Meta-audit skill; no functional overlap. |
| `chat-to-skill-publisher` | unrelated | Tooling for authoring skills; not scaffolding. |

## Interaction

1. Show the user the table above.
2. Ask: "Should `agent-files` be recorded as a parent of this draft?" On `yes`, append to `inferred_parents`.
3. Surface the `overlap_warning` for `manuscript-revision-agent-files`:
   - "This draft overlaps with `manuscript-revision-agent-files`. Options: (a) narrow the draft to thesis chapters only, (b) drop the draft and extend `manuscript-revision-agent-files`, (c) proceed anyway." Record the user's choice in `open_questions` if it is deferred.

## Draft Writes

After confirmation, the skill writes:

```yaml
# .temp/thesis-chapter-agent-files/skill.yaml
...
parents:
  - agent-files
```

```markdown
# .temp/thesis-chapter-agent-files/README.md
...
## Parents

- `agent-files` — specializes the four-file AGENT contract for thesis-chapter revision.
```

## Outputs

- `inferred_parents`: `["agent-files"]`
- `warnings`: `["overlap: manuscript-revision-agent-files — narrow the draft or extend that skill instead"]`
- `open_questions`: `[]` if the user resolved the overlap, otherwise the deferred decision is listed here
