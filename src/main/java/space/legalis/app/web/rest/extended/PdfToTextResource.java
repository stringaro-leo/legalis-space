package space.legalis.app.web.rest.extended;

import io.swagger.annotations.Api;
import java.io.File;
import java.io.IOException;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import org.apache.pdfbox.cos.COSDocument;
import org.apache.pdfbox.io.RandomAccessFile;
import org.apache.pdfbox.pdfparser.PDFParser;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.ModelMap;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import space.legalis.app.domain.Law;
import space.legalis.app.service.LawService;
import space.legalis.app.service.extended.TranslationExtendedService;
import tech.jhipster.web.util.HeaderUtil;

@Validated
@RestController
@RequestMapping("/api/extended")
@Api(value = "PdfToTextResource")
public class PdfToTextResource {

    private final Logger log = LoggerFactory.getLogger(PdfToTextResource.class);

    @Value("${legalis-space.pdf-to-text.upload-dir:/tmp}")
    private String uploadDir;

    public PdfToTextResource() {}

    @RequestMapping(value = "/pdf-to-text", method = RequestMethod.POST)
    public List<String> multiplePdfToText(@RequestParam("file") MultipartFile files[]) throws IOException {
        log.debug("REST request to upload one pdf file and return content as text.");
        List<String> result = new ArrayList<>();
        if (null != files && files.length > 0) {
            for (MultipartFile file : files) {
                File destFile = new File(uploadDir + "/" + file.getOriginalFilename());
                file.transferTo(destFile);

                /*
                 * Source: https://www.baeldung.com/pdf-conversions-java
                 */
                String parsedText;
                PDFParser parser = new PDFParser(new RandomAccessFile(destFile, "r"));
                parser.parse();

                COSDocument cosDoc = parser.getDocument();
                PDFTextStripper pdfStripper = new PDFTextStripper();
                PDDocument pdDoc = new PDDocument(cosDoc);
                parsedText = pdfStripper.getText(pdDoc);

                result.add(parsedText);
            }
        }
        return result;
    }
}
