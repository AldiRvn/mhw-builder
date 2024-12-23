import { Location } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { AugmentationSlotComponent } from './components/augmentation-slot/augmentation-slot.component';
import { ModalComponent } from './components/common/modal/modal.component';
import { DecorationSlotComponent } from './components/decoration-slot/decoration-slot.component';
import { EquippedSkillsComponent } from './components/equipped-skills/equipped-skills.component';
import { EquippedStatsComponent } from './components/equipped-stats/equipped-stats.component';
import { ItemSlotComponent } from './components/item-slot/item-slot.component';
import { TooltipComponent } from './components/tooltip/tooltip.component';
import { BuildService } from './services/build.service';
import { DataService } from './services/data.service';
import { SlotService } from './services/slot.service';
import { EquipmentCategoryType } from './types/equipment-category.type';
import { ItemType } from './types/item.type';
import { PointerType } from './types/pointer.type';
import html2canvas from 'html2canvas';

@Component({
	selector: 'mhw-builder-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit, AfterViewInit {
	public equipmentCategoryTypes = EquipmentCategoryType;
	public itemTypes = ItemType;

	@ViewChild(EquippedStatsComponent, { static: true }) equippedStatsComponent: EquippedStatsComponent;
	@ViewChild(EquippedSkillsComponent, { static: true }) equippedSkillsComponent: EquippedSkillsComponent;
	@ViewChild(TooltipComponent, { static: true }) tooltipComponent: TooltipComponent;
	@ViewChild('weaponSlot', { static: true }) weaponSlot: ItemSlotComponent;
	@ViewChild('headSlot', { static: true }) headSlot: ItemSlotComponent;
	@ViewChild('chestSlot', { static: true }) chestSlot: ItemSlotComponent;
	@ViewChild('armsSlot', { static: true }) armsSlot: ItemSlotComponent;
	@ViewChild('waistSlot', { static: true }) waistSlot: ItemSlotComponent;
	@ViewChild('legsSlot', { static: true }) legsSlot: ItemSlotComponent;
	@ViewChild('charmSlot', { static: true }) charmSlot: ItemSlotComponent;
	@ViewChild('tool1Slot', { static: true }) tool1Slot: ItemSlotComponent;
	@ViewChild('tool2Slot', { static: true }) tool2Slot: ItemSlotComponent;

	@ViewChild('itemListModal', { static: true }) itemListModal: ModalComponent;
	@ViewChild('changeLogModal', { static: true }) changeLogModal: ModalComponent;
	@ViewChild('setListModal', { static: true }) setListModal: ModalComponent;
	@ViewChild('contributorsModal', { static: true }) contributorsModal: ModalComponent;

	equipmentVisible = true;
	statsVisible = true;

	tabsVisible = false;
	attackDefenseVisible = true;
	skillsVisible = true;
	buffsVisible = true;
	detailsVisible = true;

	modalTitle: string;

	selectedEquipmentSlot: ItemSlotComponent;
	selectedDecorationSlot: DecorationSlotComponent;
	selectedAugmentationSlot: AugmentationSlotComponent;

	@HostListener('window:resize')
	onResize() {
		this.respondToResize();
	}

	constructor(
		public slotService: SlotService,
		public dataService: DataService,
		private buildService: BuildService,
		private changeDetector: ChangeDetectorRef,
		private location: Location
	) { }

	ngOnInit(): void {
		this.slotService.initialize(
			this.weaponSlot,
			this.headSlot,
			this.chestSlot,
			this.armsSlot,
			this.waistSlot,
			this.legsSlot,
			this.charmSlot,
			this.tool1Slot,
			this.tool2Slot,
			this.changeDetector
		);

		this.respondToResize();

		this.buildService.initialize(this.changeDetector);

		this.buildService.buildIdUpdated$.subscribe(buildId => {
			this.location.replaceState(this.location.path(false), '#' + buildId);
		});

		this.slotService.anySlotSelected$.subscribe(slot => {
			if (this.itemListModal) {
				this.itemListModal.title = `Select ${slot.slotName}`;
				this.itemListModal.isOpen = slot != null;
			}
		});

		this.slotService.itemSelected$.subscribe(item => {
			if (this.itemListModal) {
				this.itemListModal.isOpen = !item;
			}
		});

		this.slotService.decorationSelected$.subscribe(decoration => {
			if (this.itemListModal) {
				this.itemListModal.isOpen = !decoration;
			}
		});

		this.slotService.augmentationSelected$.subscribe(augmentation => {
			if (this.itemListModal) {
				this.itemListModal.isOpen = !augmentation;
			}
		});

		this.slotService.upgradeSelected$.subscribe(upgrade => {
			if (this.itemListModal) {
				this.itemListModal.isOpen = !upgrade;
			}
		});

		this.slotService.setbonusSelected$.subscribe(setBonus => {
			if (this.itemListModal) {
				this.itemListModal.isOpen = !setBonus;
			}
		});

		this.slotService.modificationSelected$.subscribe(modification => {
			if (this.itemListModal) {
				this.itemListModal.isOpen = !modification;
			}
		});

		this.slotService.kinsectSelected$.subscribe(kinsect => {
			if (this.itemListModal) {
				this.itemListModal.isOpen = !kinsect;
			}
		});
	}

	ngAfterViewInit() {
		if (location.hash) {
			this.buildService.loadBuild(location.hash);
		}
	}

	respondToResize() {
		if (window.innerWidth <= 768) {
			if (!this.equipmentVisible && this.statsVisible) {
				this.equipmentVisible = false;
				this.statsVisible = true;
				this.attackDefenseVisible = true;
				this.skillsVisible = false;
				this.buffsVisible = true;
			} else {
				this.equipmentVisible = true;
				this.statsVisible = false;
				this.attackDefenseVisible = false;
				this.skillsVisible = false;
				this.buffsVisible = false;
			}
			this.tabsVisible = true;
		} else {
			this.equipmentVisible = true;
			this.statsVisible = true;
			this.attackDefenseVisible = true;
			this.skillsVisible = true;
			this.buffsVisible = true;
			this.tabsVisible = false;
		}
	}

	equipmentSelected() {
		this.equipmentVisible = true;
		this.statsVisible = false;
	}

	statsSelected() {
		this.equipmentVisible = false;
		this.statsVisible = true;
		this.attackDefenseVisible = true;
		this.skillsVisible = false;
		this.detailsVisible = true;
		this.buffsVisible = true;
	}
	skillsSelected() {
		this.equipmentVisible = false;
		this.statsVisible = true;
		this.attackDefenseVisible = false;
		this.skillsVisible = true;
		this.detailsVisible = false;
		this.buffsVisible = false;
	}

	@HostListener('document:keydown', ['$event']) onKeydownHandler(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			document.getElementById('dummy').focus();
		}
	}

	moveTooltip(event: PointerEvent) {
		if (event.pointerType == PointerType.Mouse) {
			this.tooltipComponent.move(event.clientX, event.clientY);
		}
	}

	openItemListModal() {
		if (this.itemListModal.isOpen) {
			this.itemListModal.close();
		} else {
			this.itemListModal.open();
		}
	}

	openChangeLog() {
		this.changeLogModal.open();
	}

	openSaveModal() {
		this.setListModal.open();
	}

	clearAllItems() {
		if (confirm('Are you sure you want to clear all items?')) {
			this.buildService.loadBuild('#v3iiiiiiiii');
		} else {
		}
	}

	screenshot() {
		html2canvas(document.body).then(function(canvas) {
			var a = document.createElement('a');
			a.setAttribute('download', new Date().toISOString()+'.MHW-Builder.png');
			a.setAttribute('href', canvas.toDataURL("image/png").replace("image/png", "image/octet-stream"));
			a.click();
		});
	}

	openContributors() {
		this.contributorsModal.open();
	}
}
