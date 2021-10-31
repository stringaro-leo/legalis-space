package space.legalis.app.service.impl;

import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import space.legalis.app.domain.Treaty;
import space.legalis.app.repository.TreatyRepository;
import space.legalis.app.service.TreatyService;

/**
 * Service Implementation for managing {@link Treaty}.
 */
@Service
public class TreatyServiceImpl implements TreatyService {

    private final Logger log = LoggerFactory.getLogger(TreatyServiceImpl.class);

    private final TreatyRepository treatyRepository;

    public TreatyServiceImpl(TreatyRepository treatyRepository) {
        this.treatyRepository = treatyRepository;
    }

    @Override
    public Treaty save(Treaty treaty) {
        log.debug("Request to save Treaty : {}", treaty);
        return treatyRepository.save(treaty);
    }

    @Override
    public Optional<Treaty> partialUpdate(Treaty treaty) {
        log.debug("Request to partially update Treaty : {}", treaty);

        return treatyRepository
            .findById(treaty.getId())
            .map(existingTreaty -> {
                if (treaty.getDescription() != null) {
                    existingTreaty.setDescription(treaty.getDescription());
                }
                if (treaty.getName() != null) {
                    existingTreaty.setName(treaty.getName());
                }
                if (treaty.getVoteDate() != null) {
                    existingTreaty.setVoteDate(treaty.getVoteDate());
                }
                if (treaty.getEffectiveDate() != null) {
                    existingTreaty.setEffectiveDate(treaty.getEffectiveDate());
                }

                return existingTreaty;
            })
            .map(treatyRepository::save);
    }

    @Override
    public List<Treaty> findAll() {
        log.debug("Request to get all Treaties");
        return treatyRepository.findAll();
    }

    @Override
    public Optional<Treaty> findOne(String id) {
        log.debug("Request to get Treaty : {}", id);
        return treatyRepository.findById(id);
    }

    @Override
    public void delete(String id) {
        log.debug("Request to delete Treaty : {}", id);
        treatyRepository.deleteById(id);
    }
}
