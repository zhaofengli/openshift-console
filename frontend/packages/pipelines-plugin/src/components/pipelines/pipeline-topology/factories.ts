import {
  ComponentFactory,
  DagreLayout,
  GraphComponent,
  LayoutFactory,
  ModelKind,
  Graph,
  TaskEdge,
  PipelineDagreLayout,
  withPanZoom,
  SpacerNode,
  DefaultTaskGroup,
} from '@patternfly/react-topology';
import ApprovalTaskNode from './ApprovalTaskNode';
import BuilderFinallyNode from './BuilderFinallyNode';
import BuilderNode from './BuilderNode';
import { NodeType, PipelineLayout } from './const';
import CustomTaskNode from './CustomTaskNode';
import FinallyNode from './FinallyNode';
import InvalidTaskListNode from './InvalidTaskListNode';
import LoadingNode from './LoadingNode';
import PipelineTaskNode from './PipelineTaskNode';
import BuilderTaskEdge from './TaskEdge';
import TaskListNode from './TaskListNode';
import TaskNode from './TaskNode';
import { getLayoutData } from './utils';

export const builderComponentsFactory: ComponentFactory = (kind: ModelKind, type: string) => {
  switch (kind) {
    case ModelKind.graph:
      return GraphComponent;
    case ModelKind.edge:
      return BuilderTaskEdge;
    case ModelKind.node:
      switch (type) {
        case NodeType.TASK_NODE:
          return TaskNode;
        case NodeType.SPACER_NODE:
          return SpacerNode;
        case NodeType.TASK_LIST_NODE:
          return TaskListNode;
        case NodeType.INVALID_TASK_LIST_NODE:
          return InvalidTaskListNode;
        case NodeType.BUILDER_NODE:
          return BuilderNode;
        case NodeType.FINALLY_NODE:
          return FinallyNode;
        case NodeType.BUILDER_FINALLY_NODE:
          return BuilderFinallyNode;
        case NodeType.LOADING_NODE:
          return LoadingNode;
        default:
          return undefined;
      }
    default:
      return undefined;
  }
};

export const dagreViewerComponentFactory: ComponentFactory = (kind: ModelKind, type: string) => {
  switch (kind) {
    case ModelKind.graph:
      return withPanZoom()(GraphComponent);
    case ModelKind.edge:
      return TaskEdge;
    case ModelKind.node:
      switch (type) {
        case NodeType.TASK_NODE:
        case NodeType.FINALLY_NODE:
          return PipelineTaskNode;
        case NodeType.CUSTOM_TASK_NODE:
          return CustomTaskNode;
        case NodeType.APPROVAL_TASK_NODE:
          return ApprovalTaskNode;
        case NodeType.FINALLY_GROUP:
          return DefaultTaskGroup;
        case NodeType.SPACER_NODE:
          return SpacerNode;
        default:
          return undefined;
      }
    default:
      return undefined;
  }
};

export const layoutFactory: LayoutFactory = (type: string, graph: Graph) => {
  switch (type) {
    case PipelineLayout.DAGRE_BUILDER:
    case PipelineLayout.DAGRE_BUILDER_SPACED:
      return new DagreLayout(graph, {
        // Hack to get around undesirable defaults
        // TODO: fix this, it's not ideal but it works for now
        linkDistance: 0,
        nodeDistance: 0,
        groupDistance: 0,
        collideDistance: 0,
        simulationSpeed: 0,
        chargeStrength: 0,
        allowDrag: false,
        layoutOnDrag: false,
        ...getLayoutData(type),
      });
    case PipelineLayout.DAGRE_VIEWER:
      return new PipelineDagreLayout(graph, { nodesep: 25 });
    default:
      return undefined;
  }
};
