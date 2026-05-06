import FloatingPanel from "@/shared/components/ui/FloatingPanel";
import { useUiStore } from "@/features/ui/store/uiStore";
import { usePageSettingsDraft } from "../hooks/usePageSettingsDraft";
import styles from "./PageSettingsPanel.module.css";

export default function PageSettingsPanel() {
  const isOpen = useUiStore((s) => s.panels.pageSettings.open);
  const closePanel = useUiStore((s) => s.closePanel);

  const form = usePageSettingsDraft(isOpen);

  const applyAndClose = () => {
    form.apply();
    closePanel("pageSettings");
  };

  return (
    <FloatingPanel
      panelId="pageSettings"
      title="Configurações da Página"
      width={460}
      height={720}
    >
      <div className={styles.form}>
        <div className={styles.field}>
          <label>Nome da Página</label>

          <input
            className="game-input"
            value={form.draftPageName}
            onChange={(e) => form.setDraftPageName(e.target.value)}
            style={{ width: "100%" }}
          />
        </div>

        <div className={styles.field}>
          <label>Largura</label>

          <div className={styles.row}>
            <input
              className={`game-input ${styles.numberInput}`}
              type="number"
              min={1}
              max={500}
              value={form.draftWidthCells}
              onChange={(e) =>
                form.setDraftWidthCells(Number(e.target.value))
              }
            />

            <span className={styles.muted}>células</span>
            <span className={styles.separator}>×</span>
            <span className={styles.muted}>
              {form.preview.settings.cellSize}px
            </span>
            <span className={styles.separator}>=</span>
            <strong>{form.preview.size.width}px</strong>
          </div>
        </div>

        <div className={styles.field}>
          <label>Altura</label>

          <div className={styles.row}>
            <input
              className={`game-input ${styles.numberInput}`}
              type="number"
              min={1}
              max={500}
              value={form.draftHeightCells}
              onChange={(e) =>
                form.setDraftHeightCells(Number(e.target.value))
              }
            />

            <span className={styles.muted}>células</span>
            <span className={styles.separator}>×</span>
            <span className={styles.muted}>
              {form.preview.settings.cellSize}px
            </span>
            <span className={styles.separator}>=</span>
            <strong>{form.preview.size.height}px</strong>
          </div>
        </div>

        <div className={styles.field}>
          <label>Tamanho da Célula</label>

          <div className={styles.row}>
            <input
              className={`game-input ${styles.numberInput}`}
              type="number"
              min={20}
              max={200}
              value={form.draftCellSize}
              onChange={(e) =>
                form.setDraftCellSize(Number(e.target.value))
              }
            />

            <span className={styles.muted}>px/célula</span>
          </div>
        </div>

        <div className={`game-card ${styles.resultCard}`}>
          Resultado final:{" "}
          <strong>
            {form.preview.settings.widthCells} ×{" "}
            {form.preview.settings.heightCells}
          </strong>{" "}
          células —{" "}
          <strong>
            {form.preview.size.width}px × {form.preview.size.height}px
          </strong>
        </div>

        <div className={styles.field}>
          <label>Imagem de Fundo</label>

          <div className={styles.imageSection}>
            {form.draftBackgroundImage && (
              <div
                className={styles.previewImage}
                style={{
                  backgroundImage: `url(${form.draftBackgroundImage})`,
                }}
              />
            )}

            {form.draftImageSize && (
              <div className={styles.imageInfo}>
                Imagem:{" "}
                <strong>
                  {form.draftImageSize.width}px ×{" "}
                  {form.draftImageSize.height}px
                </strong>
              </div>
            )}

            {form.shouldShowFitImageOption && form.imageGridSuggestion && (
              <div className={`game-card ${styles.fitCard}`}>
                <div>
                  A imagem tem proporção/tamanho diferente do mapa atual.
                  Podemos ajustar o grid para o tamanho mais próximo sem
                  distorcer a imagem:
                </div>

                <strong>
                  {form.imageGridSuggestion.widthCells} ×{" "}
                  {form.imageGridSuggestion.heightCells} células
                </strong>

                <button
                  type="button"
                  className="game-button game-button-primary"
                  onClick={form.applyImageSizeToGrid}
                >
                  Adequar grid à imagem
                </button>
              </div>
            )}

            <div className={styles.actions}>
              <button
                type="button"
                className="game-button"
                onClick={() => form.fileInputRef.current?.click()}
              >
                Escolher imagem
              </button>

              <button
                type="button"
                className="game-button"
                onClick={form.removeBackgroundImage}
              >
                Remover
              </button>
            </div>

            <input
              ref={form.fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={form.chooseBackgroundImage}
            />
          </div>
        </div>

        <div className={styles.footer}>
          <button
            type="button"
            className="game-button"
            onClick={() => closePanel("pageSettings")}
          >
            Cancelar
          </button>

          <button
            type="button"
            className="game-button game-button-primary"
            onClick={applyAndClose}
          >
            Aplicar
          </button>
        </div>
      </div>
    </FloatingPanel>
  );
}