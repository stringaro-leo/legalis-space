package space.legalis.app.web.rest.extended;

import io.swagger.annotations.Api;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import space.legalis.app.domain.Law;
import space.legalis.app.domain.Translation;
import space.legalis.app.service.LawService;
import space.legalis.app.service.TranslationService;
import space.legalis.app.service.extended.TranslationExtendedService;
import tech.jhipster.web.util.ResponseUtil;

@Validated
@RestController
@RequestMapping("/api/extended")
@Api(value = "TranslationExtendedResource")
public class TranslationExtendedResource {

    private final Logger log = LoggerFactory.getLogger(TranslationExtendedResource.class);

    private final TranslationExtendedService translationExtendedService;

    private final LawService lawService;

    public TranslationExtendedResource(LawService lawService, TranslationExtendedService translationExtendedService) {
        this.lawService = lawService;
        this.translationExtendedService = translationExtendedService;
    }

    /**
     * {@code GET  /translations/search} : search translations for given parameters.
     *
     * @param type the type of the translations to retrieve.
     * @param typeId the type_id of the translation to retrieve.
     * @param language the language of the translation to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of translations found in body.
     */
    @GetMapping("/translations/search")
    @ResponseBody
    public List<Law> searchTranslationsByTypeAndTypeId(
        @RequestParam String type,
        @RequestParam String typeId,
        @RequestParam(required = false) String language
    ) {
        log.debug("REST request to get all Translations for type '{}', type_id '{}', language '{}'", type, typeId, language);

        List<Law> laws = lawService.findAll();
        return laws;
        //        return translationExtendedService.searchTranslationsByTypeAndTypeId(type, typeId, language);
    }
}
