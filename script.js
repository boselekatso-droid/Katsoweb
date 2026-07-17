document.addEventListener('DOMContentLoaded', () => {
    const button = document.getElementById('download-cv-btn');
    const cvElement = document.querySelector('main.page');

    if (!button || !cvElement) return;

    const createClone = () => {
        const clone = cvElement.cloneNode(true);
        const hiddenContainer = document.createElement('div');
        hiddenContainer.style.position = 'absolute';
        hiddenContainer.style.left = '-9999px';
        hiddenContainer.style.top = '0';
        hiddenContainer.style.width = '210mm';
        hiddenContainer.style.opacity = '0';
        hiddenContainer.style.pointerEvents = 'none';
        hiddenContainer.style.overflow = 'hidden';
        hiddenContainer.appendChild(clone);
        document.body.appendChild(hiddenContainer);
        return { clone, hiddenContainer };
    };

    const cleanupClone = (container) => {
        if (container && container.parentNode) {
            container.parentNode.removeChild(container);
        }
    };

    button.addEventListener('click', async () => {
        const { clone, hiddenContainer } = createClone();

        const printStyle = document.createElement('style');
        printStyle.textContent = `
            /* A4 print reset for cloned CV (does not affect live page) */
            @page { size: A4; margin: 18mm; }
            html, body { background: #fff !important; color: #000 !important; }
            body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; }
            main.page { max-width: 210mm; width: 100%; padding: 0; margin: 0 auto; }
            /* Neutralize hero and card decorations */
            .hero, .card, .skill-group, .reference-item, .experience-item { background: #fff !important; color: #000 !important; box-shadow: none !important; border: none !important; }
            h1, h2, h3, p, li, a { color: #000 !important; }
            a { text-decoration: none; }
            img { max-width: 100%; height: auto; page-break-inside: avoid; border-radius: 0 !important; box-shadow: none !important; }
            /* Avoid breaking important blocks */
            .card, .skill-group, .reference-item, .experience-item { page-break-inside: avoid; }
            section.card { page-break-after: auto; }
            /* Ensure the download button is hidden in the printed clone */
            #download-cv-btn, .download-cv-hidden { display: none !important; }
            /* Remove background images/gradients */
            * { background-image: none !important; background: transparent !important; }
            @media print {
                .top-nav, #download-cv-btn, .download-cv-hidden { display: none !important; }
            }
        `;
        hiddenContainer.appendChild(printStyle);

        try {
            await html2pdf()
                .set({
                    margin: [18, 18, 18, 18],
                    filename: 'Katso_Bosele_CV.pdf',
                    image: { type: 'jpeg', quality: 0.98 },
                    html2canvas: { scale: 2, useCORS: true },
                    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
                    pagebreak: { mode: ['css', 'legacy'] }
                })
                .from(clone)
                .save();
        } catch (error) {
            console.error('PDF generation error', error);
        } finally {
            cleanupClone(hiddenContainer);
        }
    });
});
