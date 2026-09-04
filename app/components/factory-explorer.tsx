"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  factoryExplorerCapabilities,
  factoryExplorerStages,
  type FactoryCapabilityId,
} from "../../data/factory-explorer";
import { dependencyModernizationExample } from "../../data/dependency-modernization-example";

const defaultStageId = "prove";
const defaultCapabilityId: FactoryCapabilityId = "evals";

function stageHasCapability(stage: (typeof factoryExplorerStages)[number], capabilityId: FactoryCapabilityId) {
  return (stage.capabilities as ReadonlyArray<FactoryCapabilityId>).includes(capabilityId);
}

export function FactoryExplorer() {
  const [selectedStageId, setSelectedStageId] = useState(defaultStageId);
  const [selectedCapabilityId, setSelectedCapabilityId] = useState<FactoryCapabilityId>(defaultCapabilityId);
  const stageList = useRef<HTMLDivElement | null>(null);
  const stageButtons = useRef<Array<HTMLButtonElement | null>>([]);
  const selectedStage = factoryExplorerStages.find((stage) => stage.id === selectedStageId) ?? factoryExplorerStages[0];
  const selectedStageIndex = factoryExplorerStages.findIndex((stage) => stage.id === selectedStage.id);
  const selectedCapability = factoryExplorerCapabilities.find((capability) => capability.id === selectedCapabilityId) ?? factoryExplorerCapabilities[7];
  const selectedCapabilityParticipates = stageHasCapability(selectedStage, selectedCapability.id);
  const exampleStep = dependencyModernizationExample.runtimeSteps.find((step) => step.stepId === selectedStage.id);
  const exampleRecords = exampleStep?.artifacts.flatMap((artifactId) => {
    const artifact = dependencyModernizationExample.artifacts.find((item) => item.protocolId === artifactId);
    return artifact ? [artifact.exampleId] : [];
  }) ?? [];

  useEffect(() => {
    const container = stageList.current;
    const defaultIndex = factoryExplorerStages.findIndex((stage) => stage.id === defaultStageId);
    const button = stageButtons.current[defaultIndex];
    if (!container || !button || container.scrollWidth <= container.clientWidth) return;
    container.scrollLeft = button.offsetLeft - ((container.clientWidth - button.offsetWidth) / 2);
  }, []);

  function selectStage(index: number, moveFocus = false) {
    const nextStage = factoryExplorerStages[index];
    if (!nextStage) return;
    setSelectedStageId(nextStage.id);
    setSelectedCapabilityId(nextStage.focusCapability);
    requestAnimationFrame(() => {
      const container = stageList.current;
      const button = stageButtons.current[index];
      if (container && button && container.scrollWidth > container.clientWidth) {
        container.scrollTo({
          behavior: "smooth",
          left: button.offsetLeft - ((container.clientWidth - button.offsetWidth) / 2),
        });
      }
      if (moveFocus) button?.focus({ preventScroll: true });
    });
  }

  function handleStageKeyDown(event: React.KeyboardEvent<HTMLButtonElement>, index: number) {
    let nextIndex: number | undefined;
    if (event.key === "ArrowRight") nextIndex = (index + 1) % factoryExplorerStages.length;
    if (event.key === "ArrowLeft") nextIndex = (index - 1 + factoryExplorerStages.length) % factoryExplorerStages.length;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = factoryExplorerStages.length - 1;
    if (nextIndex === undefined) return;
    event.preventDefault();
    selectStage(nextIndex, true);
  }

  return (
    <section className="factory-explorer" aria-labelledby="factory-explorer-title">
      <div className="factory-explorer-chrome">
        <div>
          <p className="orientation-label" id="factory-explorer-title">Interactive factory explorer</p>
          <strong>Follow one unit of work</strong>
        </div>
        <div className="factory-explorer-controls">
          <p id="factory-explorer-instructions">
            Choose a stage. Then inspect the capabilities it activates.
            <span className="factory-explorer-swipe-hint">Swipe the lifecycle <span aria-hidden="true">↔</span></span>
          </p>
          <div className="factory-explorer-progress" aria-label={`Stage ${selectedStage.number} of ${factoryExplorerStages.length}`} role="group">
            <button
              aria-label="View previous execution stage"
              disabled={selectedStageIndex === 0}
              onClick={() => selectStage(selectedStageIndex - 1)}
              type="button"
            >
              <span aria-hidden="true">←</span>
            </button>
            <span>{String(selectedStage.number).padStart(2, "0")} / {String(factoryExplorerStages.length).padStart(2, "0")}</span>
            <button
              aria-label="View next execution stage"
              disabled={selectedStageIndex === factoryExplorerStages.length - 1}
              onClick={() => selectStage(selectedStageIndex + 1)}
              type="button"
            >
              <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>
      </div>

      <div
        className="factory-explorer-stages"
        aria-describedby="factory-explorer-instructions"
        aria-label="Public execution shorthand stages"
        ref={stageList}
        role="tablist"
      >
        {factoryExplorerStages.map((stage, index) => {
          const selected = stage.id === selectedStage.id;
          return (
            <button
              aria-controls="factory-explorer-stage-panel"
              aria-selected={selected}
              className={selected ? "is-selected" : undefined}
              id={`factory-explorer-tab-${stage.id}`}
              key={stage.id}
              onClick={() => selectStage(index)}
              onKeyDown={(event) => handleStageKeyDown(event, index)}
              ref={(element) => { stageButtons.current[index] = element; }}
              role="tab"
              tabIndex={selected ? 0 : -1}
              type="button"
            >
              <span>{String(stage.number).padStart(2, "0")} / {stage.artifact}</span>
              <strong>{stage.name}</strong>
            </button>
          );
        })}
      </div>

      <div
        aria-labelledby={`factory-explorer-tab-${selectedStage.id}`}
        className="factory-explorer-stage-panel"
        id="factory-explorer-stage-panel"
        role="tabpanel"
        tabIndex={0}
      >
        <div className="factory-explorer-stage-copy">
          <p className="factory-explorer-kicker">Stage {String(selectedStage.number).padStart(2, "0")} / {selectedStage.artifact}</p>
          <h3>{selectedStage.question}</h3>
          <p>{selectedStage.purpose}</p>
          <div className="factory-explorer-state">
            <span>State earned</span>
            <strong>{selectedStage.stateEarned}</strong>
          </div>
        </div>
        <dl className="factory-explorer-ledger">
          <div>
            <dt>Durable record</dt>
            <dd>{selectedStage.artifact}</dd>
          </div>
          <div>
            <dt>Evidence required</dt>
            <dd>{selectedStage.proof}</dd>
          </div>
          <div>
            <dt>Factory coordination</dt>
            <dd>{selectedStage.participation}</dd>
          </div>
        </dl>
        <aside className="factory-explorer-example" aria-label={`Dependency modernization example at ${selectedStage.name}`}>
          <div>
            <span>Worked example</span>
            <h4>{dependencyModernizationExample.title}</h4>
          </div>
          <div>
            <p>{exampleStep?.action}</p>
            <ul aria-label="Example records created at this stage">
              {exampleRecords.map((record) => <li key={record}>{record}</li>)}
            </ul>
          </div>
          <nav aria-label="Explore this stage in depth">
            <Link href="/in-5-minutes">Full walkthrough <span aria-hidden="true">→</span></Link>
            <a href={selectedStage.guideHref}>Guide deep dive <span aria-hidden="true">→</span></a>
          </nav>
        </aside>
      </div>

      <div className="factory-explorer-capabilities">
        <div className="factory-explorer-capability-heading">
          <div>
            <p className="orientation-label">Factory capabilities</p>
            <strong>{selectedStage.capabilities.length} of {factoryExplorerCapabilities.length} participate at {selectedStage.name}</strong>
          </div>
          <span>Active capabilities are marked in green</span>
        </div>
        <div className="factory-explorer-capability-grid" aria-label={`Factory capabilities participating at ${selectedStage.name}`} role="group">
          {factoryExplorerCapabilities.map((capability) => {
            const participates = stageHasCapability(selectedStage, capability.id);
            const selected = capability.id === selectedCapability.id;
            const className = [participates ? "is-participating" : "", selected ? "is-selected" : ""].filter(Boolean).join(" ");
            return (
              <button
                aria-pressed={selected}
                className={className || undefined}
                key={capability.id}
                onClick={() => setSelectedCapabilityId(capability.id)}
                type="button"
              >
                <span>{String(capability.number).padStart(2, "0")}</span>
                <strong>{capability.name}</strong>
                <small>{participates ? `Active at ${selectedStage.name}` : "Available to the factory"}</small>
              </button>
            );
          })}
        </div>

        <article className="factory-explorer-capability-detail" aria-live="polite">
          <div>
            <span>{selectedCapabilityParticipates ? `Participates at ${selectedStage.name}` : `Not primary at ${selectedStage.name}`}</span>
            <h4>{selectedCapability.name}</h4>
          </div>
          <p>{selectedCapability.responsibility}</p>
          <Link href={selectedCapability.architectureHref}>
            Explore the {selectedCapability.architectureArea} area <span aria-hidden="true">→</span>
          </Link>
        </article>
      </div>
    </section>
  );
}
