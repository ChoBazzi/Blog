type ArchitectureMapProps = {
  id: string;
};

const maps: Record<string, ArchitectureMapData> = {
  "bizkit-ai": {
    eyebrow: "Architecture Map",
    title: "BizKit AI Server",
    description: "Spring 도메인 서버와 FastAPI AI 오케스트레이터를 분리하고, 모델별 실행 경로를 독립적으로 확장할 수 있게 구성했습니다.",
    flow: [
      {
        icon: "/tech-icons/react.svg",
        name: "Frontend",
        detail: "요청 제출, 상태 조회, 결과 표시",
        tone: "cyan",
      },
      {
        icon: "/tech-icons/spring.svg",
        name: "Spring Backend",
        detail: "도메인, 권한, 정책, API Gateway",
        tone: "green",
      },
      {
        icon: "/tech-icons/fastapi.svg",
        name: "FastAPI Server",
        detail: "작업 생성, Worker 실행, 후처리",
        tone: "teal",
      },
      {
        icon: "/tech-icons/redis.svg",
        name: "Redis Streams",
        detail: "비동기 Queue, 진행률, 단기 캐시",
        tone: "red",
      },
      {
        icon: "/tech-icons/runpod.svg",
        name: "RunPod Models",
        detail: "vLLM, SDXL, Embedding 모델 서빙",
        tone: "violet",
      },
    ],
    dependencyGroups: [
      {
        anchor: "frontend",
        title: "Frontend -> FastAPI direct",
        nodes: [
          {
            icon: "/tech-icons/fastapi.svg",
            name: "OCR API",
            detail: "인증/인가 없이 명함 이미지 필드 추출",
            tone: "teal",
          },
        ],
      },
      {
        anchor: "spring",
        title: "Spring Backend connects",
        nodes: [
          {
            icon: "/tech-icons/postgres.svg",
            name: "Spring RDB",
            detail: "도메인 데이터 조회 후 AI 서버로 전달",
            tone: "blue",
          },
        ],
      },
      {
        anchor: "fastapi",
        title: "FastAPI Server connects",
        nodes: [
          {
            icon: "/tech-icons/github.svg",
            name: "GitHub API",
            detail: "FastAPI가 6각 차트 원천 데이터 수집",
            tone: "slate",
          },
          {
            icon: "/tech-icons/s3.svg",
            name: "S3 Storage",
            detail: "명함 이미지와 생성 결과 저장",
            tone: "orange",
          },
          {
            icon: "/tech-icons/milvus.svg",
            name: "Milvus",
            detail: "직무 검색, 시맨틱 캐시",
            tone: "indigo",
          },
        ],
      },
    ],
    dataFlows: [
      {
        name: "OCR scan",
        badge: "Direct",
        description: "인증/인가가 필요 없는 명함 이미지 추출 작업은 Frontend가 FastAPI OCR API를 직접 호출합니다.",
        steps: [
          { icon: "/tech-icons/react.svg", name: "Frontend", detail: "image upload", tone: "cyan" },
          { icon: "/tech-icons/fastapi.svg", name: "FastAPI OCR", detail: "field extraction", tone: "teal" },
          { icon: "/tech-icons/runpod.svg", name: "OCR Pipeline", detail: "model inference", tone: "violet" },
          { icon: "/tech-icons/react.svg", name: "Frontend", detail: "normalized fields", tone: "cyan" },
        ],
      },
      {
        name: "Card generation",
        badge: "Spring gated",
        description: "명함 도메인 정보와 저장 정책이 필요하므로 Spring이 요청을 검증한 뒤 FastAPI 작업으로 전달합니다.",
        steps: [
          { icon: "/tech-icons/react.svg", name: "Frontend", detail: "style + card data", tone: "cyan" },
          { icon: "/tech-icons/spring.svg", name: "Spring", detail: "domain check", tone: "green" },
          { icon: "/tech-icons/fastapi.svg", name: "FastAPI", detail: "task + render flow", tone: "teal" },
          { icon: "/tech-icons/runpod.svg", name: "SDXL / LLM", detail: "background + prompt", tone: "violet" },
          { icon: "/tech-icons/s3.svg", name: "S3", detail: "image result", tone: "orange" },
          { icon: "/tech-icons/spring.svg", name: "Spring", detail: "card result save", tone: "green" },
        ],
      },
      {
        name: "Job analysis",
        badge: "Async",
        description: "회사/부서/직무 입력은 Spring을 통해 전달되고, FastAPI가 검색 컨텍스트와 LLM 결과를 JSON으로 제한합니다.",
        steps: [
          { icon: "/tech-icons/react.svg", name: "Frontend", detail: "job request", tone: "cyan" },
          { icon: "/tech-icons/spring.svg", name: "Spring", detail: "user context", tone: "green" },
          { icon: "/tech-icons/fastapi.svg", name: "FastAPI", detail: "query + confidence", tone: "teal" },
          { icon: "/tech-icons/redis.svg", name: "Redis", detail: "task progress", tone: "red" },
          { icon: "/tech-icons/runpod.svg", name: "vLLM", detail: "JSON generation", tone: "violet" },
          { icon: "/tech-icons/spring.svg", name: "Spring", detail: "result delivery", tone: "green" },
        ],
      },
      {
        name: "HEX analysis",
        badge: "Evidence first",
        description: "GitHub 원천 데이터는 FastAPI가 수집하고, 리뷰/사용자 데이터는 Spring이 전달한 컨텍스트를 사용합니다.",
        steps: [
          { icon: "/tech-icons/spring.svg", name: "Spring", detail: "user + review data", tone: "green" },
          { icon: "/tech-icons/fastapi.svg", name: "FastAPI", detail: "metric pipeline", tone: "teal" },
          { icon: "/tech-icons/github.svg", name: "GitHub API", detail: "repo activity", tone: "slate" },
          { icon: "/tech-icons/runpod.svg", name: "vLLM", detail: "score explanation", tone: "violet" },
          { icon: "/tech-icons/postgres.svg", name: "RDB", detail: "analysis result", tone: "blue" },
        ],
      },
      {
        name: "Semantic search",
        badge: "Vector",
        description: "자연어 검색과 직무 필터링은 FastAPI가 임베딩을 만들고 Milvus에서 후보를 조회합니다.",
        steps: [
          { icon: "/tech-icons/spring.svg", name: "Spring Search", detail: "search request", tone: "green" },
          { icon: "/tech-icons/fastapi.svg", name: "FastAPI", detail: "embedding request", tone: "teal" },
          { icon: "/tech-icons/runpod.svg", name: "BGE-m3-ko", detail: "vector encode", tone: "violet" },
          { icon: "/tech-icons/milvus.svg", name: "Milvus", detail: "top-k lookup", tone: "indigo" },
          { icon: "/tech-icons/spring.svg", name: "Spring", detail: "domain response", tone: "green" },
        ],
      },
    ],
  },
};

export function ArchitectureMap({ id }: ArchitectureMapProps) {
  const map = maps[id];

  if (!map) {
    return null;
  }

  return (
    <section className="architecture-map" aria-label={map.title}>
      <div className="architecture-map-header">
        <p>{map.eyebrow}</p>
        <h3>{map.title}</h3>
        <span>{map.description}</span>
      </div>
      <div className="architecture-flow">
        <div className="architecture-flow-label">Request / Async Workflow</div>
        <div className="architecture-flow-track">
          {map.flow.map((node) => (
            <ArchitectureNodeCard node={node} variant="flow" key={node.name} />
          ))}
        </div>
        <div className="architecture-branch-label">Connected by server framework</div>
        <div className="architecture-dependency-track">
          {map.dependencyGroups.map((group) => (
            <section className={`architecture-dependency-group architecture-anchor-${group.anchor}`} key={group.title}>
              <h4>{group.title}</h4>
              <div className="architecture-dependency-nodes">
                {group.nodes.map((node) => (
                  <ArchitectureNodeCard node={node} variant="branch" key={node.name} />
                ))}
              </div>
            </section>
          ))}
        </div>
        <div className="architecture-data-label">Data Movement by Feature</div>
        <div className="architecture-data-board">
          {map.dataFlows.map((flow) => (
            <section className="architecture-data-row" key={flow.name}>
              <div className="architecture-data-copy">
                <span>{flow.badge}</span>
                <h4>{flow.name}</h4>
                <p>{flow.description}</p>
              </div>
              <div className="architecture-data-steps">
                {flow.steps.map((node, index) => (
                  <ArchitectureNodeCard
                    node={node}
                    variant={index === flow.steps.length - 1 ? "branch" : "data"}
                    key={`${flow.name}-${node.name}-${index}`}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </section>
  );
}

function ArchitectureNodeCard({ node, variant }: { node: ArchitectureNode; variant: "branch" | "data" | "flow" }) {
  return (
    <article
      className={[
        "architecture-node",
        `architecture-node-${node.tone}`,
        `architecture-node-${variant}`,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={node.icon} alt="" />
      <div>
        <strong>{node.name}</strong>
        <span>{node.detail}</span>
      </div>
    </article>
  );
}

type ArchitectureMapData = {
  eyebrow: string;
  title: string;
  description: string;
  flow: ArchitectureNode[];
  dependencyGroups: Array<{
    anchor: "fastapi" | "frontend" | "spring";
    title: string;
    nodes: ArchitectureNode[];
  }>;
  dataFlows: Array<{
    name: string;
    badge: string;
    description: string;
    steps: ArchitectureNode[];
  }>;
};

type ArchitectureNode = {
  icon: string;
  name: string;
  detail: string;
  tone: "blue" | "cyan" | "green" | "indigo" | "orange" | "red" | "slate" | "teal" | "violet";
};
